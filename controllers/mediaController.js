const cloudinary = require('../config/cloudinaryConfig');  // Import Cloudinary config
const User = require('../models/userModel');  // Or use your model if you're uploading for clues
const multer = require('multer');  // Import multer

// Use memory storage since we are uploading directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),  // Store the file in memory
}).single('file');  // This should match the name of the form field in the request

// Route to handle media file uploads
const uploadMedia = async (req, res) => {
  try {
    const file = req.file;  // Multer stores the uploaded file in memory

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.buffer, {
      folder: 'game_media',  // Optionally, specify the folder in Cloudinary
    });

    // Save media URL in DB (For profile image, save the URL in User model)
    const user = await User.findById(req.user.id);  // Get user from DB
    user.profilePicture = result.secure_url;  // Save the URL in the user schema
    await user.save();

    // Respond with the media URL
    res.json({
      message: 'File uploaded successfully!',
      url: result.secure_url,  // Return the media URL
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

module.exports = { uploadMedia };
