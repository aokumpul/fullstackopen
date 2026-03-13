const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog")

const api = supertest(app)

const initialBlogs = [
  {
    title: "My Frog Blog",
    author: "Dr. Froggy",
    url: "www.myfrogblog.com",
    likes: 64
  },
  {
    title: "My Dog Blog",
    author: "Mr. Puppy",
    url: "www.mydogblog.com",
    likes: 666
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialBlogs[0])
  await noteObject.save()
  noteObject = new Blog(initialBlogs[1])
  await noteObject.save()
})

describe('HTTP GET to /api/blogs', () => {
  test('returns a correct number of blogs as a JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('returns blogs which have an unique identifier field named as "id"', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert(blogs.every(b => b.id))
    assert.strictEqual(blogs.every(b => b._id), false)
  })
})

describe('HTTP POST to /api/blogs', () => {
  test('adds a valid blog and increases the number of blogs by one', async () => {
    const newBlog = {
      title: "My Cat Blog",
      author: "Ms. Kitten",
      url: "www.mycatblog.com",
      likes: 69
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlogs = await api.get('/api/blogs')

    assert.strictEqual(updatedBlogs.body.length, initialBlogs.length + 1)
    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.author, newBlog.author)
    assert.strictEqual(response.body.url, newBlog.url)
    assert.strictEqual(response.body.likes, newBlog.likes)
  })

  test('missing a value on likes defaults it to zero', async () => {
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
})

after(async () => {
  await mongoose.connection.close()
})