const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  character: { type: String },
  
  resetToken: String,
  resetTokenExpiry: Date,

  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player'
  }
});

module.exports = mongoose.model('User', userSchema);
