require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

// Models (we'll define them below)
const User = require("./models/User");
const Post = require("./models/Post");
const Message = require("./models/Message");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ================================
// REST API ROUTES
// ================================

// Test backend
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// -----------------
// USERS
// -----------------

// Signup
app.post("/api/users/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailPhone, password } = req.body;

    if (!firstName || !lastName || !emailPhone || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await User.findOne({ emailPhone });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      emailPhone,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  try {
    const { emailPhone, password } = req.body;

    const user = await User.findOne({ emailPhone });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, user: { firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------
// POSTS
// -----------------
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const { authorId, content, mediaUrl } = req.body;
    const post = new Post({ authorId, content, mediaUrl });
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------
// MESSAGES
// -----------------
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const message = new Message({ senderId, receiverId, text });
    await message.save();
    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// SPA fallback
// ================================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================================
// CONNECT TO MONGO AND START SERVER
// ================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on https://ahoreda-backend.onrender.com`));
  })
  .catch((err) => console.log("MongoDB error ❌", err));