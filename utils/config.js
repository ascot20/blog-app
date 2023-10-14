require('dotenv').config()

const url = process.env.NODE_ENV === 'test' ? process.env.MONGODB_TEST : process.env.MONGODB_URI
const port = process.env.PORT

module.exports = {
  url,
  port
}
