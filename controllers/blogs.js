const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();
  
  res.status(201).json(savedBlog);
});

module.exports = blogRouter;
