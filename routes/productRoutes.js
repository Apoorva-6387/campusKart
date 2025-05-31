const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      condition,
      usage,
      college,
      user,
      phone,
      email,
      sellerName
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      title,
      description,
      category,
      price,
      condition,
      usage,
      college,
      user,
      phone,
      email,
      sellerName,
      image: req.file.filename
    });

    await product.save();
    res.json({ message: 'Product posted successfully!' });
  } catch (err) {
    console.error('❌ Error posting product:', err);
    res.status(500).json({ message: 'Server error while posting product' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
