const mongoose = require('mongoose');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const testingRouter = require('./controllers/testing');

const app = express();

mongoose.set('strictQuery', false);

const mongoUrl = config.MONGODB_URI;

app.connectToDb = async () => {
  try {
    await mongoose.connect(mongoUrl);
    logger.info('Connected to db');
  } catch (ex) {
    logger.err('Failed to connect to db');
  }
};

app.connectToDb();

app.disconnectFromDb = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Disconnected from db');
  } catch (ex) {
    logger.err('Failed to disconnect from db');
  }
};

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unkownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
