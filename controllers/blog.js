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
  res.status(201).json(savedNote)
})

blogRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    await Blog.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const body = req.body
  try {
    const result = await Blog.findByIdAndUpdate(id, body, { new: true })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
