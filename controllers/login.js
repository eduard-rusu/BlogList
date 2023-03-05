const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).send({ error: 'User not found' });
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) return res.status(400).send({ error: 'Incorrect passowrd' });

  const token = jwt.sign(
    {
      username: user.username,
      id: user.id,
    },
    process.env.SECRET,
  );
  return res.status(200).send({ token, username: user.username });
});

module.exports = loginRouter;
