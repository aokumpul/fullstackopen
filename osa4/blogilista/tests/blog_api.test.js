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

  test.only('fails with status code 400 if title is missing', async () => {
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

  test.only('fails with status code 400 0 if url is missing', async () => {
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

after(async () => {
  await mongoose.connection.close()
})