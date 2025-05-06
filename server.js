require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const connectDB = require('./config/db');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const clueRoutes = require('./routes/clueRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const lobbyRoute = require('./routes/lobbyRoute');
const adminRoutes = require('./routes/adminRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const searchRoutes = require('./routes/searchRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Cloudinary Config (if you're using it)
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Check Cloudinary keys
console.log('Cloudinary Cloud Name:', process.env.CLOUD_NAME);
console.log('Cloudinary API Key:', process.env.CLOUD_API_KEY);
console.log('Cloudinary API Secret:', process.env.CLOUD_API_SECRET);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      const sanitizedFileName = file.originalname.replace(/[^\w\s]/gi, '_');
      cb(null, Date.now() + "_" + sanitizedFileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Connect to DB
connectDB();

// App Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Route Mounting
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/clues', clueRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', adminRoutes); // Admin routes (e.g. /api/admin/stats)
app.use('/api', lobbyRoute);  // Lobby route
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes); // <-- Stripe payment route

// Standalone upload route using multer
app.post('/api/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', fileUrl: `/uploads/${req.file.filename}` });
});

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
