const User = require('../models/userModel');
const Clue = require('../models/clueModel');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// DELETE user by ID
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};

const Game = require('../models/gameModel'); // Make sure this model exists

// GET all game sessions
const getAllGameSessions = async (req, res) => {
  try {
    const sessions = await Game.find().populate('user', 'name email');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch game sessions', error });
  }
};

const getAdminStats = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalGames = await Game.countDocuments();
      const totalClues = await Clue.countDocuments(); // make sure Clue model exists!
  
      res.json({ totalUsers, totalGames, totalClues });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats', error });
    }
  };
  
  // PUT /api/admin/users/:id/promote
const promoteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: 'admin' },
        { new: true }
      ).select('-password');
  
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
  
      res.json({ message: 'User promoted to admin', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Failed to promote user', error });
    }
  };
  

  module.exports = {
    getAllUsers,
    deleteUserById,
    getAllGameSessions,
    promoteUser,
    getAdminStats, // ✅ must be included here
  };
  
