const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  if (!username || !password) {
    return res.status(400).send({ error: 'username or password required' })
  }

  if (password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs')

  res.status(200).json(users)
})

module.exports = userRouter
