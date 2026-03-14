const Blog = require("../models/blog")

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'tempblog', author: 'me', url: 'helsinki.fi' })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}