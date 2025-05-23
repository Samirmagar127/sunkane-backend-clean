const express = require('express');
const router = express.Router();
const {
  createClue,
  deleteClue,
  updateClue,
  getAllClues // ✅ Add this
} = require('../controllers/clueController'); 

const authenticateToken = require('../middlewares/authMiddleware'); 
const isAdmin = require('../middlewares/isAdmin'); 

// 🔽 Add this GET route (accessible to authenticated users)
router.get('/', authenticateToken, getAllClues); 

router.post('/clues', authenticateToken, isAdmin, createClue); 
router.put('/clues/:id', authenticateToken, isAdmin, updateClue);
router.delete('/clues/:id', authenticateToken, isAdmin, deleteClue);

module.exports = router;
