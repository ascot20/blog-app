const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
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

afterAll(async () => {
  await mongoose.connection.close()
}, 100000)
