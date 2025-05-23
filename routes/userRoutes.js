const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  registerUser,
  loginUser,
  getMe,
  selectCharacter,
  updateUserProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/UserController'); // ✅ lowercase

// Auth & User Profile routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/me', authMiddleware, updateUserProfile);
router.get('/me', authMiddleware, getMe);
router.post('/character', authMiddleware, selectCharacter);
router.put('/profile', authMiddleware, updateUserProfile);

// ✅ Test route
router.get('/test', (req, res) => {
  res.json({ message: 'User route is working!' });
});

module.exports = router;
