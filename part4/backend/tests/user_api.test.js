const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

test('user with invalid username are not created and returns 400 and error message', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUserInvalidUsername = {
    username: 'ss',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  await api
    .post('/api/users')
    .send(newUserInvalidUsername)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('user with invalid password are not created and returns 400 and error message', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUserInvalidUsername = {
    username: 'mluukai',
    name: 'Matti Luukkainen',
    password: 'ss'
  }

  await api
    .post('/api/users')
    .send(newUserInvalidUsername)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})
