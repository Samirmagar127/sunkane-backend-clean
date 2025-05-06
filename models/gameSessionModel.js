// backend/models/gameSessionModel.js
const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
