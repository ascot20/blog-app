const logger = require("./logger");

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.info(err.message);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    res.status(400).send({ error: err.message });
  }
  next(err);
};

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:", req.path);
  logger.info("Body:", req.body);
  logger.info("---");

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
};
