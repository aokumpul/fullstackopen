const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require("../models/blog")

const api = supertest(app)

const initialBlogs = [
  {
    "title": "My Frog Blog",
    "author": "Dr. Froggy",
    "url": "www.myfrogblog.com",
    "likes": 64
  },
  {
    "title": "My Dog Blog",
    "author": "Mr. Puppy",
    "url": "www.mydogblog.com",
    "likes": 666
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
  test('returns a correct count of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('returns all the blogs as a JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})