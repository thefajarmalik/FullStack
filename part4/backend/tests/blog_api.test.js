const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

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

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert(blog.id)
  })
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Lets just say this is a title',
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf',
    likes: 10
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(savedBlog.body.title, newBlog.title)
  assert.strictEqual(savedBlog.body.author, newBlog.author)
  assert.strictEqual(savedBlog.body.url, newBlog.url)
  assert.strictEqual(savedBlog.body.likes, newBlog.likes)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('Lets just say this is a title'))
})

test('if likes is missing, default to 0', async () => {
  const newBlog = {
    title: 'Lets just say this is a title',
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf'
  }

  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(savedBlog.body.likes, 0)
})

test('if url is missing, respond 400', async () => {
  const newBlog = {
    title: 'Lets just say this is a title',
    author: 'John Doe',
    likes: 10
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('if title is missing, respond 400', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf',
    likes: 10
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
