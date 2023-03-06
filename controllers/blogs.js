const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const { tokenExtractor } = require('../utils/middleware');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 });
  res.json(blogs);
});

blogRouter.post('/', tokenExtractor, async (req, res) => {
  if (!req.token) return res.status(401).send({ error: 'Missing token' });

  const tokenUser = jwt.verify(req.token, process.env.SECRET);

  const user = await User.findById(tokenUser.id);
  if (!user) return res.status(404).send({ error: 'User not found' });

  req.body.user = user.id;
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  return res.status(201).json(savedBlog);
});

blogRouter.delete('/:id', tokenExtractor, async (req, res) => {
  if (!req.token) return res.status(401).end();

  const tokenUser = jwt.verify(req.token, process.env.SECRET);
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).end();

  if (blog.user.toString() !== tokenUser.id) return res.status(400).send({ error: 'Blog owner does not match token owner' });
  Blog.deleteOne(blog);

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
