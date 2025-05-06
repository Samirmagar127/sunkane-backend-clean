const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
        _id: user._id, name: user.name, email: user.email,
        token: generateToken(user._id),
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        res.json({
            _id: user._id, name: user.name, email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};

// @desc    Set character for user
// @route   POST /api/users/character
// @access  Private
const selectCharacter = async (req, res) => {
    const { character } = req.body;
  
    if (!character) {
      return res.status(400).json({ message: 'Character is required' });
    }
  
    try {
      req.user.character = character;
      await req.user.save();
  
      res.status(200).json({ message: 'Character selected', character });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
 
const getMe = async (req, res) => {
    res.status(200).json({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      character: req.user.character || null,
    });
  };
  
  const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.character = req.body.character || user.character;
  
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        character: updatedUser.character || null,
        message: 'Profile updated successfully'
      });
  
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }; // ✅ CLOSE IT HERE
      

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
      await user.save();
  
      const resetLink = `http://localhost:3000/reset-password/${token}`;
  
      // Nice HTML Email Template
      const message = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        We received a request to reset your password. Click the button below to reset it. This link is valid for 1 hour.
      </p>
      <div style="text-align: center; margin: 20px;">
        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #999; text-align: center;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <p style="font-size: 14px; color: #999; text-align: center;">
        &copy; 2025 Sunkane Lane Mystery Game
      </p>
    </div>
  </body>
  </html>
  `;
  
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });
  
      res.json({ message: "Password reset link sent to your email." });
  
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };
  
  
  const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
  
    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
  
    return res.json({ message: "Password reset successful" });
  };
  
  
  
  module.exports = {
    registerUser,
    loginUser,
    getMe,
    selectCharacter,
    updateUserProfile,
    forgotPassword,
    resetPassword
  };