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
