const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 });
  res.json(blogs);
});

blogRouter.post('/', async (req, res) => {
  if (!req.token || !req.user) return res.status(401).end();

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send({ error: 'User not found' });

  // eslint-disable-next-line no-underscore-dangle
  req.body.user = user._id;
  const blog = new Blog(req.body);
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  return res.status(201).json(await savedBlog.populate('user', { username: 1 }));
});

blogRouter.delete('/:id', async (req, res) => {
  if (!req.token || !req.user) return res.status(401).end();
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).end();
  if (blog.user.toString() !== req.user.id) return res.status(400).send({ error: 'Blog owner does not match token owner' });
  await Blog.deleteOne(blog);
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
