const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.getTokenFrom,
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body
    if (!body.likes) {
      body.likes = 0
    }
    if (!body.url || !body.title) {
      return response.status(400).json({ error: 'no title or url' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: request.user
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
  }
)

blogsRouter.delete(
  '/:id',
  middleware.getTokenFrom,
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    console.log(`User ${request.user.id} is trying to delete blog created by ${blog.user}`)
    if (blog.user.toString() !== request.user.id.toString()) {
      return response
        .status(401)
        .json({ error: 'cannot delete blog not created by the user' })
    }
    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  }
)

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
  response.json(updatedBlog)
})

module.exports = blogsRouter
