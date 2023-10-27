const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const response = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(response)
})

blogRouter.post('/', async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).end()
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user.id
  })

  const savedNote = await blog.save()
  user.blogs = user.blogs.concat(savedNote.id)
  await user.save()
  const fetchSavedNote = await Blog.findById(savedNote.id).populate('user', { username: 1, name: 1 })
  res.status(201).json(fetchSavedNote)
})

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  const blog = await Blog.findById(id)

  if (blog.user.toString() === decodedToken.id) {
    await Blog.findByIdAndDelete(id)
    return res.status(204).end()
  }

  res.status(401).end()
})

blogRouter.put('/:id', async (req, res) => {
  const blogID = req.params.id
  const body = req.body

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const user = await User.findById(decodedToken.id)
  const userBlogIDs = user.blogs.map(id => id.toString())

  if (!userBlogIDs.includes(blogID)) {
    return res.status(401).end()
  }

  const result = await Blog.findByIdAndUpdate(blogID, body, { new: true })
  res.status(200).json(result)
})

module.exports = blogRouter
