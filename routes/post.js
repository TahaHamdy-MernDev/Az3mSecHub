const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protectedRoute } = require("../utils/protectedRoute");

// Create
router.post("/create", async (req, res) => {
  try {
    const newPost = new Post({ ...req.body });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(400).json("Error Create Post !!~");
  }
});

// Get (ID)
router.get("/get/:id", async (req, res) => {
  try {
    const findPost = await Post.findById(req.params.id);
    if (!findPost) return res.status(404).json({ error: "Post Not Found 😔" });
    res.status(200).json(findPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get (ALL)
router.get("/all/get", async (req, res) => {
  try {
    const getAllPosts = await Post.find();
    res.status(200).json(getAllPosts);
  } catch (error) {
    res.status(400).json("Error Get Post !!~");
  }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Successful 🥰" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//UPDATE POST
router.put("/update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $set: req.body }, { new: true });
    res.status(200).json("Updated Post Success ☻♥");
  } catch (error) {
    res.status(400).json("Error Update Post !!~");
  }
});

module.exports = router;
