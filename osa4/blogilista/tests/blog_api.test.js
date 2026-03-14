const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require("../models/blog")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

describe('when there are initially some blogs saved'), () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have a unique identifier field "id"', async () => {
    const response = await api.get('/api/blogs')
    const body = response.body

    assert(body.every(b => b.id))
    assert.strictEqual(body.every(b => b._id), false)
  })
}

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: "My Cat Blog",
      author: "Ms. Kitten",
      url: "www.mycatblog.com",
      likes: 69
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(newBlog.title))
  })

  test('defaults likes to zero if missing', async () => {
    const newBlog = {
      title: "My Nonfamous Blog",
      author: "Mr. Nobody",
      url: "www.myblog.com",
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: "Herra Hakkarainen",
      url: "www.herrahakkis.fi",
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: "Herra Hakkaraisen blogi",
      author: "Herra Hakkarainen",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${validNonExistingId}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating an existing blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes = 9999

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert.strictEqual(response.body.likes, blogToUpdate.likes)
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .expect(404)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .put(`/api/blogs/${invalidId}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })
})

after(async () => {
  await mongoose.connection.close()
})