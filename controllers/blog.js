const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res, next) => {
  try {
    const response = await Blog.find({})
    res.json(response)
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (req, res, next) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).end()
  }
  const blog = new Blog({ ...req.body, likes: req.body.likes || 0 })

  try {
    const response = await blog.save()
    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
