const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  price: Number,
  condition: String,
  usage: String,
  college: String,
  user: String,
  phone: String,
  email: String,
  sellerName: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
