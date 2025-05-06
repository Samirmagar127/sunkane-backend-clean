const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig'); // Cloudinary config file
const router = express.Router();

// Multer storage setup - storing file in memory
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limiting file size to 5MB

// POST route for uploading media
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Check if the file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' }, // Automatically handles both images and videos
          (error, result) => {
            if (error) {
              return reject(error);  // Handle Cloudinary errors here
            }
            resolve(result);  // Return result when uploaded
          }
        );
        // Pipe the file buffer into Cloudinary upload stream
        file.stream.pipe(uploadStream); 
      });
    };

    // Call the stream upload function and get the Cloudinary result
    const result = await streamUpload(req.file);

    // Return the URL of the uploaded file
    res.status(200).json({
      message: 'File uploaded successfully!',
      url: result.secure_url, // Cloudinary file URL
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading to Cloudinary' });
  }
});

module.exports = router;
