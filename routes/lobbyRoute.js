const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/lobby', authenticateToken, (req, res) => {
  res.json({ message: 'You reached the protected lobby route!' });
});

module.exports = router;
