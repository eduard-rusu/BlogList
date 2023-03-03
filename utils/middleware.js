const logger = require('./logger');

const unkownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unkown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  if (err.name === 'ValidationError') return res.status(400).end();
  next();
};

module.exports = {
  unkownEndpoint,
  errorHandler,
};
