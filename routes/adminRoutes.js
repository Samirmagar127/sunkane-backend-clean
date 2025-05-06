const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const {
  getAllUsers,
  deleteUserById,
  getAllGameSessions,
  promoteUser,
  getAdminStats
} = require('../controllers/adminController');

router.get('/admin-dashboard', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});



router.get('/admin/users', authenticateToken, isAdmin, getAllUsers);
router.put('/admin/users/:id/promote', authenticateToken, isAdmin, promoteUser);



router.delete('/admin/users/:id', authenticateToken, isAdmin, deleteUserById);
router.get('/admin/sessions', authenticateToken, isAdmin, getAllGameSessions);
router.get('/admin/stats', authenticateToken, isAdmin, getAdminStats);

module.exports = router;
