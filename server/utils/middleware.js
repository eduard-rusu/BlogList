/* eslint-disable no-else-return */
const jwt = require('jsonwebtoken');
const logger = require('./logger');

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.includes('Bearer ')) {
    req.token = auth.replace('Bearer ', '');
  }
  next();
};

const userExtractor = (req, res, next) => {
  if (req.token) req.user = jwt.verify(req.token, process.env.SECRET);
  next();
};

const unkownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unkown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  // logger.error(err.name);
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  } else if (err.name === 'MongoServerError') {
    return res.status(400).send({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: err.message });
  }

  return next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
  unkownEndpoint,
  errorHandler,
};
