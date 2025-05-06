const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ✅ required for populate()
  clues: [{ type: String }],
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Game', gameSchema);
