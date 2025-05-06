const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../config/cloudinaryConfig'); // Cloudinary setup
const router = express.Router();

// Set up multer for in-memory storage (we're using memoryStorage to hold the file in buffer)
const storage = multer.memoryStorage();  // Use memoryStorage for buffer

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
});

// POST: /api/media/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Uploading file from buffer to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.buffer, {
      resource_type: 'auto',  // Automatically detect whether the file is an image or video
      folder: 'game_media',    // Optionally, specify the folder in Cloudinary
    });

    // Return the URL of the uploaded media from Cloudinary
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: result.secure_url,  // Get the URL from Cloudinary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;
