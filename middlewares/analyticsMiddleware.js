const Analytics = require('../models/analyticsModel');

const analyticsLogger = async (req, res, next) => {
  try {
    await Analytics.create({
      route: req.originalUrl,
      method: req.method,
      user: req.user ? req.user._id : null,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  } catch (err) {
    console.error('Analytics logging failed:', err.message);
  }
  next();
};

module.exports = analyticsLogger;