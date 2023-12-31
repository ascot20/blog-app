const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const api = supertest(app)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFzY290IiwiaWQiOiI2NTMxYTNmODZiZWMzZGMxMTgwOWRkNTAiLCJpYXQiOjE2OTc3NTIwNTd9.-Ydvs1elAMf7T4WFxlefgVTAnbG8VuCMPVeMzznZ7TA'

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
  await User.deleteMany({})
  const testUser = {
    username: 'ascot',
    password: 'ascot1621',
    name: 'Daniel Otchere'
  }
  await api.post('/api/users').send(testUser)
}, 100000)

test('blogs returned are json format', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.blogs.length)
})

test('id is defined as id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('create a new blog', async () => {
  const newBlog = {
    title: 'Mandalorian',
    author: 'Rob Lee',
    url: 'http://blog.Starwars.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set({ Authorization: token })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((blog) => blog.title)

  expect(response.body).toHaveLength(helper.blogs.length + 1)
  expect(titles).toContain('Mandalorian')
})

test('likes should default to 0 if missing from request', async () => {
  const newBlog = {
    title: 'Mandalorian',
    author: 'Rob Lee',
    url: 'http://blog.Starwars.com/uncle-bob/2016/05/01/TypeWars.html'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('return bad request if title or url is empty', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    likes: 0
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.blogs.length)
})

test('delete a blog with valid id', async () => {
  const response = await api.get('/api/blogs')
  const blogsAtStart = response.body
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body).toHaveLength(helper.blogs.length - 1)
})

test('update a blog with a valid id', async () => {
  const updatedBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 9
  }

  await api.put('/api/blogs/5a422a851b54a676234d17f7').send(updatedBlog).expect(200).expect('Content-Type', /application\/json/)
})

describe('test user creation', () => {
  test('when username length is less than 3', async () => {
    const user = {
      username: 'as',
      password: 'krodinger',
      name: 'Schwarner'
    }

    await api.post('/api/users').send(user).expect(400).expect('Content-Type', /application\/json/)
  })

  test('when all inputs are valid', async () => {
    const user = {
      username: 'ascot',
      password: 'krodinger',
      name: 'Schwarner'
    }

    await api.post('/api/users').send(user).expect(201).expect('Content-Type', /application\/json/)
  })

  test('when password is less than 3', async () => {
    const user = {
      username: 'ascot',
      password: 'kr',
      name: 'Schwarner'
    }

    await api.post('/api/users').send(user).expect(400).expect('Content-Type', /application\/json/)
  })
})

describe('test for login route', () => {
  test('when username and password exist', async () => {
    const testUserLogin = {
      username: 'ascot',
      password: 'ascot1621'
    }

    const response = await api.post('/api/login').send(testUserLogin).expect(200).expect('content-type', /application\/json/)

    console.log(response.body.token)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
}, 100000)
