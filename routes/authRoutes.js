const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Signup failed', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    user: {
      name: user.name,
      role: user.role,
      college: user.college,
      email: user.email,
      phone: user.phone,
    }
  });
});

module.exports = router;
