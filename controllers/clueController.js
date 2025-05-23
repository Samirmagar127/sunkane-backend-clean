const Clue = require('../models/clueModel');

const collectClue = async (req, res) => {
  const { gameId, text } = req.body;

  if (!gameId || !text) {
    return res.status(400).json({ message: 'Game ID and clue text are required' });
  }

  try {
    const clue = await Clue.create({
      user: req.user._id,
      game: gameId,
      text,
    });

    res.status(201).json({
      message: 'Clue saved',
      clueId: clue._id,
      foundAt: clue.foundAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCluesByGame = async (req, res) => {
    try {
      const clues = await Clue.find({ game: req.params.gameId }).sort({ foundAt: 1 });
      res.json(clues);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };

const createClue = async (req, res) => {
  try {
    const clue = new Clue(req.body);
    await clue.save();
    res.status(201).json(clue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create clue', error });
  }
};

const getAllClues = async (req, res) => {
  try {
    const clues = await Clue.find().sort({ foundAt: -1 }); // or .find({ user: req.user._id }) if needed
    res.status(200).json(clues);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch clues' });
  }
};

const updateClue = async (req, res) => {
  try {
    const clue = await Clue.findById(req.params.id);

    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    clue.text = req.body.text || clue.text;

    await clue.save();

    res.json({ message: 'Clue updated successfully', clue });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update clue', error });
  }
};

const deleteClue = async (req, res) => {
  try {
    const clue = await Clue.findById(req.params.id);

    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    await clue.remove();

    res.json({ message: 'Clue deleted successfully' });
  } catch (error) {
    console.error('Error deleting clue:', error);
    res.status(500).json({ message: 'Failed to delete clue', error });
  }
};

module.exports = {
  collectClue,
  getCluesByGame,
  getAllClues,
  createClue,
  updateClue,
  deleteClue, 
};

