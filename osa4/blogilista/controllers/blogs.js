const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  if (!body.title) {
    return response.status(400).json({ error: 'title is required' })
  }

  if (!body.url) {
    return response.status(400).json({ error: 'url is required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).end()
  }

  await Blog.findByIdAndDelete(blog.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = body.title
  blog.author = body.author
  blog.url = body.url
  blog.likes = body.likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter