const express = require('express');
const router = express.Router();
const { createClue, deleteClue, updateClue } = require('../controllers/clueController'); 
const authenticateToken = require('../middlewares/authMiddleware'); 
const isAdmin = require('../middlewares/isAdmin'); 

router.post('/clues', authenticateToken, isAdmin, createClue); 
router.put('/clues/:id', authenticateToken, isAdmin, updateClue);
router.delete('/clues/:id', authenticateToken, isAdmin, deleteClue);

module.exports = router;