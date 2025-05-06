const Game = require('../models/gameModel');
const User = require('../models/userModel');

const getLeaderboard = async (req, res) => {
  try {
    const results = await Game.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$user', completedGames: { $sum: 1 } } },
      { $sort: { completedGames: -1 } },
      { $limit: 10 }
    ]);

    const leaderboard = await Promise.all(
      results.map(async (entry) => {
        const user = await User.findById(entry._id).select('name email character');
        return {
          name: user.name,
          email: user.email,
          character: user.character,
          completedGames: entry.completedGames,
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLeaderboard };
