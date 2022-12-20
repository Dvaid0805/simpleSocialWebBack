import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { registerValidator } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';

mongoose.connect(
  'mongodb+srv://admin:wwwwww@cluster0.tmhexux.mongodb.net/blog?retryWrites=true&w=majority'
).then(() => console.log('DB ok')).catch(error => console.log(error));


const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if(!user) {
      return res.status(404).join({
        message: 'User is not find'
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if(!isValidPass) {
      return res.status(400).join({
        message: 'Login or password are not correct',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token
    });
  } catch(e) {
    console.log(e);
    res.status(500).json({
      message: 'failed to login'
    });
  }
})

app.post('/auth/register', registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await  bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token
    });

  } catch(e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to register'
    })
  }
});

app.listen(4444, (err) => {
  if(err) {
    return console.log(err);
  }

  console.log('Server, ok');
});