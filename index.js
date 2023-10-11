const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.port, () => {
  logger.info(`listening on port ${config.port}`)
})
