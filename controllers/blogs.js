const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const parseToken = (req) => {
  const auth = req.get('authorization');
  if (auth && auth.includes('Bearer ')) return auth.replace('Bearer ', '');
  return null;
};

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 });
  res.json(blogs);
});

blogRouter.post('/', async (req, res) => {
  const token = parseToken(req);
  if (!token) return res.status(400).send({ error: 'Missing token' });

  const tokenUser = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(tokenUser.id);
  if (!user) return res.status(404).send({ error: 'User not found' });

  req.body.user = user.id;
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  return res.status(201).json(savedBlog);
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
