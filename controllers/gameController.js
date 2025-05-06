const Game = require('../models/gameModel'); 

const startGame = async (req, res) => {
  try {
    const game = await Game.create({
      userId: req.user._id,
      character: req.user.character || 'Detective',
      clues: [],
      completed: false
    });

    res.status(200).json({ message: 'Game started', game });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const completeGame = async (req, res) => {
  try {
    const game = await Game.findOne({
      userId: req.user._id,
      completed: false
    });

    if (!game) {
      return res.status(404).json({ message: 'No active game found' });
    }

    game.completed = true;
    await game.save();

    res.status(200).json({ message: 'Game completed', game });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMyGames = async (req, res) => {
  // your logic here
};

const getLeaderboard = async (req, res) => {
  try {
    const topGames = await Game.find({ status: 'completed' })
      .sort({ startedAt: 1 }) // You can change to `duration` if you store it
      .limit(10);

    res.status(200).json(topGames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getGameProgress = async (req, res) => {
  try {
    const game = await Game.findOne({
      userId: req.user.id,
      status: 'in_progress'
    });

    if (!game) {
      return res.status(404).json({ message: 'No active game' });
    }

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const collectClue = async (req, res) => {
  try {
    const game = await Game.findOne({ userId: req.user._id, completed: false });

    if (!game) {
      return res.status(404).json({ message: 'No active game session' });
    }

    // Sample clue logic — you can improve later
    const clue = `Clue #${game.clues.length + 1}: Footprints found near the bar...`;

    game.clues.push(clue);
    await game.save();

    res.status(200).json({ clue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  startGame,
  completeGame,
  getMyGames,
  getLeaderboard,
  getGameProgress,
  collectClue,
};