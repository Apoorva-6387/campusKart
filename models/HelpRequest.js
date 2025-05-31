const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Help = require('../models/Help');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const help = new Help({
      title: req.body.title,
      college: req.body.college,
      description: req.body.description,
      user: req.body.user,
      image: req.file ? req.file.filename : null
    });
    await help.save();
    res.json({ message: 'Help request posted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving help request', error: err.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const helps = await Help.find().sort({ createdAt: -1 });
    res.json(helps);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching help posts' });
  }
});

module.exports = router;
