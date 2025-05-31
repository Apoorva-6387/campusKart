const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Help = require('../models/Help');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const help = new Help({
      ...req.body,
      image: req.file ? req.file.filename : null
    });
    await help.save();
    res.json({ message: 'Help posted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to post help' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const helps = await Help.find().sort({ createdAt: -1 });
    res.json(helps);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch help posts' });
  }
});

module.exports = router;
