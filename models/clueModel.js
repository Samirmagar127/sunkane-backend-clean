const mongoose = require('mongoose');

const clueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  foundAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Clue', clueSchema);
