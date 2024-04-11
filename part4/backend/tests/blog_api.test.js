const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await api.post('/api/users').send(helper.userForTest)
  const response = await api.post('/api/login').send(helper.userForTest)
  helper.token = response.body.token
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
    .set('Authorization',`Bearer ${helper.token}`)
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
    .set('Authorization',`Bearer ${helper.token}`)
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

  await api.post('/api/blogs').send(newBlog).set('Authorization',`Bearer ${helper.token}`).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('if title is missing, respond 400', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf',
    likes: 10
  }

  await api.post('/api/blogs').send(newBlog).set('Authorization',`Bearer ${helper.token}`).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('can delete a blog', async () => {
  const newBlog = {
    title: 'Lets just say this is a title',
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf',
    likes: 10
  }
  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization',`Bearer ${helper.token}`)

  console.log("savedBlog=",savedBlog)
  const blogsAtStart = await helper.blogsInDb()

  await api.delete(`/api/blogs/${savedBlog.body.id}`).set('Authorization',`Bearer ${helper.token}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(savedBlog.body.title))
})

test('cannot delete a blog without token', async () => {
  const newBlog = {
    title: 'Lets just say this is a title',
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf',
    likes: 10
  }
  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization',`Bearer ${helper.token}`)

  console.log("savedBlog=",savedBlog)
  const blogsAtStart = await helper.blogsInDb()

  await api.delete(`/api/blogs/${savedBlog.body.id}`).expect(401)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

  const titles = blogsAtEnd.map(r => r.title)
  assert(titles.includes(savedBlog.body.title))
})

test('can update a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog = {
    title: 'Lets just say this is a title',
    author: 'John Doe',
    url: 'https://lskdjfs.com/sldksdjfsdlfkjs.pdf',
    likes: 10
  }

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.title, newBlog.title)
  assert.strictEqual(updatedBlog.author, newBlog.author)
  assert.strictEqual(updatedBlog.url, newBlog.url)
  assert.strictEqual(updatedBlog.likes, newBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})
