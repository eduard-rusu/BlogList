const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs');
  if (!users) return res.status(400).end();
  return res.status(200).json(users);
});

/*
userRouter.put('/:id', async (req, res) => {
  const user = new User(req.body);
  if (!user) return res.status(404).end();
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).end();
});
*/

userRouter.post('/', async (req, res) => {
  const user = req.body;

  if (!user.password || user.password.length < 3) {
    return res.status(400).send({ error: 'Password too short' });
  }

  const userToSave = new User({
    username: user.username,
    passwordHash: await bcrypt.hash(user.password, 10),
  });
  const savedUser = await userToSave.save();
  return res.status(201).json(savedUser);
});

module.exports = userRouter;
