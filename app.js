const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const config = require('./utils/config');
const logger = require('./utils/logger');
// const middleware = require('./utils/middleware');

const app = express();

mongoose.set('strictQuery', false);

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
  .then(() => logger.info('Connected to db'))
  .catch((err) => logger.error(err));

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);

module.exports = app;
