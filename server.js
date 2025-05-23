const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const connectDB = require('./config/db');

// ✅ Debug: Check loaded env variables
console.log("✅ DEBUG - Stripe Key:", process.env.STRIPE_SECRET_KEY);
console.log("✅ DEBUG - Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("✅ DEBUG - Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
console.log("✅ DEBUG - Cloudinary API Secret:", process.env.CLOUDINARY_API_SECRET);
console.log("✅ DEBUG - Mongo URI:", process.env.MONGO_URI);

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
const analyticsLogger = require('./middlewares/analyticsMiddleware');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Cloudinary Config
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure /uploads directory exists
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

// Connect to MongoDB
connectDB();

// App Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Analytics Middleware
app.use(analyticsLogger);

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/clues', clueRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', adminRoutes);
app.use('/api', lobbyRoute);
app.use('/api/media', mediaRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Upload route
app.post('/api/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', fileUrl: `/uploads/${req.file.filename}` });
});

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Export app for Vercel (instead of app.listen)
module.exports = app;
