const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Input validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Asynchronous password hashing
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashPassword,
      firstName,
      lastName
    });

    await newUser.save();

    res.status(200).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateTokenAndSetCookie(user._id, res);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
  });

    res.status(200).json({ user , token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully 😍" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
