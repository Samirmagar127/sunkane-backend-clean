const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
require('dotenv').config(); // Ensure .env variables are loaded

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Your Cloudinary Cloud Name from .env
  api_key: process.env.CLOUD_API_KEY,  // Your Cloudinary API Key from .env
  api_secret: process.env.CLOUD_API_SECRET,  // Your Cloudinary API Secret from .env
});

// Check Cloudinary credentials for debugging
console.log('Cloudinary Cloud Name:', process.env.CLOUD_NAME);
console.log('Cloudinary API Key:', process.env.CLOUD_API_KEY);
console.log('Cloudinary API Secret:', process.env.CLOUD_API_SECRET);

module.exports = cloudinary;  // Export Cloudinary for use in other files
