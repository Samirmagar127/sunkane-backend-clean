const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const Analytics = require('../models/analyticsModel');

// GET /api/analytics
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const logs = await Analytics.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;