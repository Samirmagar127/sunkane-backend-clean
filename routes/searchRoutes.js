const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/userModel'); // Assuming you have a User model
const Clue = require('../models/clueModel'); // Assuming you have a Clue model
const GameSession = require('../models/gameSessionModel'); // Assuming you have a GameSession model

// Search Route
router.get('/', async (req, res) => {
  const { q } = req.query;  // Get query parameter from URL
  if (!q) {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    // Regex search (case-insensitive) for Users, Clues, and Game Sessions
    const regex = new RegExp(q, 'i'); // 'i' for case-insensitive search

    // Searching in Users collection
    const users = await User.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    });

    // Searching in Clues collection
    const clues = await Clue.find({
      text: { $regex: regex }
    });

    console.log("Users Found:", users);
    console.log("Clues Found:", clues);
    console.log("Sessions Found:", sessions);

    // Searching in Game Sessions collection
    const sessions = await GameSession.find({
      title: { $regex: regex }
    });

    // Return results
    res.json({ users, clues, sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while searching.' });
  }
});

module.exports = router;
