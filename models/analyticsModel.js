const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  route: String,
  method: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String
});

module.exports = mongoose.model('Analytics', analyticsSchema);