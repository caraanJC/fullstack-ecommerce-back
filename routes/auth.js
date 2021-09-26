import express from 'express';
import Users from '../models/users.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { registerValidation, loginValidation } from '../validation.js';

const router = express.Router();

// Validation

router.post('/register', async (req, res) => {
  let newUser;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      newUser = new Users({ username: req.body.username, password: hash });
    });
  });

  try {
    await registerValidation(req.body);

    const usernameExists = await Users.findOne({ username: req.body.username });

    if (emailExists || usernameExists) {
      return res
        .status(400)
        .send(`${usernameExists ? 'username' : 'email'} exists`);
    }

    const savedUser = await newUser.save();

    res.send({ user: newUser._id });
  } catch (err) {
    res.status(400).send(err.details[0].message ? err.details[0].message : err);
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    await loginValidation(req.body);

    const user = await Users.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send('Username or password is wrong');
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({ token, user });
      } else {
        res.status(400).send('Username or password is wrong');
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
