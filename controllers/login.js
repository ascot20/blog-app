const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (!user) {
    return res.status(401).send({ error: 'User not found' })
  }
  const verifyPassword = await bcrypt.compare(password, user.passwordHash)

  if (!verifyPassword) {
    return res.status(401).send({ error: 'Password is incorrect' })
  }

  const payload = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(payload, process.env.SECRET)

  res.status(200).json({ username: user.username, token, name: user.name })
})

module.exports = loginRouter
