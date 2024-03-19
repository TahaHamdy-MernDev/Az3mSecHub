const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");

// Register
router.post("/register", async (req, res) => {
  try {
    // Check User
    const user = await User.findOne({ email: req.body.email });
    user && res.status(400).json({ error: "User already exists 🙄🧐" });

    const salt = bcrypt.genSalt(10);
    const hashPassword = bcrypt.hashSync(req.body.password, parseInt(salt));
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(200).json({
        _id: newUser._id,
        fristName: newUser.fristName,
        lastName: newUser.lastName,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } else res.status(400).json({ error: "Invalid user data 😥" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("User not Found 😥");

    const validatePassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    !validatePassword && res.status(404).json("Wrong Password 😥");

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fristName: user.fristName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
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
