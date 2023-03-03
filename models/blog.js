/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    const obj = ret;
    obj.id = doc._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
