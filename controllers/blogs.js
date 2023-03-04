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

blogRouter.delete('/:id', async (req, res) => {
  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  if (!deletedBlog) return res.status(404).end();
  return res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
  const blog = req.body;
  const opts = {
    returnDocument: 'after',
    runValidators: true,
  };
  const blogToUpdate = await Blog.findByIdAndUpdate(req.params.id, blog, opts);
  if (!blogToUpdate) return res.status(404).end();
  return res.status(200).send(blogToUpdate);
});

module.exports = blogRouter;
