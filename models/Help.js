const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
  title: String,
  college: String,
  description: String,
  image: String,
  user: String
}, { timestamps: true });

module.exports = mongoose.model('Help', helpSchema);
