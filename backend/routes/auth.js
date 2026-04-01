const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const JWT_SECRET = "mysecretkey"; // later we can move to .env

// 🔐 LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔐 SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;