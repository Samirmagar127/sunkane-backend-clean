const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  startGame,
  completeGame,
  getMyGames,
  getLeaderboard,
  getGameProgress,
  collectClue // ✅ make sure this is included
} = require('../controllers/gameController');


// ✅ Use authMiddleware for all protected routes
router.post('/start', authMiddleware, startGame);
router.post('/complete', authMiddleware, completeGame);
router.get('/my-games', authMiddleware, getMyGames);
router.get('/leaderboard', getLeaderboard); // leaderboard is public
router.get('/progress', authMiddleware, getGameProgress);
router.post('/collect', authMiddleware, collectClue);

module.exports = router;
