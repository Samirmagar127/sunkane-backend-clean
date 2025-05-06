const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create-session', authenticateToken, createCheckoutSession);

module.exports = router;
