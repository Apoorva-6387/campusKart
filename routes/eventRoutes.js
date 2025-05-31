const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');

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
    const newEvent = new Event({
      title: req.body.title,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description,
      user: req.body.user,
      image: req.file.filename
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding event', error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

module.exports = router;
