require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===============================
   FILE UPLOAD CONFIG
================================ */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* ===============================
   MODELS
================================ */
const User = require("./models/User");
const Post = require("./models/Post");
const Message = require("./models/Message");

/* ===============================
   TEMP VERIFICATION STORE
================================ */
let verificationStore = {};

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   AUTH MIDDLEWARE
================================ */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid token"
      });
    }

    req.user = user;
    next();
  });
}

/* ===============================
   TEST ROUTE
================================ */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

/* ===============================
   SEND VERIFICATION CODE
================================ */
app.post("/api/users/send-code", (req, res) => {
  try {
    const { emailPhone } = req.body;

    if (!emailPhone) {
      return res.json({
        success: false,
        message: "Email or phone required"
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    verificationStore[emailPhone] = code;

    console.log("Verification code:", code);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

/* ===============================
   VERIFY CODE
================================ */
app.post("/api/users/verify-code", (req, res) => {
  try {
    const { emailPhone, code } = req.body;

    if (verificationStore[emailPhone] === code) {
      delete verificationStore[emailPhone];

      return res.json({
        success: true
      });
    }

    res.json({
      success: false,
      message: "Invalid code"
    });

  } catch {
    res.json({ success: false });
  }
});

/* ===============================
   SIGNUP
================================ */
app.post("/api/users/signup", upload.single("avatar"), async (req, res) => {
  try {

    const { firstName, lastName, emailPhone, password } = req.body;

    if (!firstName || !lastName || !emailPhone || !password) {
      return res.json({
        success:false,
        message:"All fields required"
      });
    }

    const existingUser = await User.findOne({ emailPhone });

    if(existingUser){
      return res.json({
        success:false,
        message:"User already exists"
      });
    }

    let avatarBase64 = null;

    if(req.file){
      avatarBase64 = req.file.buffer.toString("base64");
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
      firstName,
      lastName,
      emailPhone,
      password:hashedPassword,
      avatar:avatarBase64
    });

    await user.save();

    res.json({success:true});

  } catch(err){
    console.error(err);
    res.status(500).json({
      success:false,
      message:"Server error"
    });
  }
});

/* ===============================
   LOGIN
================================ */
app.post("/api/users/login", async (req, res) => {
  try {

    const { emailPhone, password } = req.body;

    const user = await User.findOne({ emailPhone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===============================
   USER PROFILE
================================ */
app.get("/api/users/profile", authenticateToken, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch {
    res.status(500).json({
      message: "Server error"
    });
  }
});

/* ===============================
   POSTS
================================ */
app.get("/api/posts", async (req, res) => {
  try {

    const posts = await Post.find().sort({ date: -1 });

    res.json(
      posts.map(post => ({
        content: post.content,
        likes: post.likes || 0,
        liked: false,
        date: post.date,
        user: {
          name: post.authorName || "Anonymous",
          avatar:
            post.authorAvatar ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
      }))
    );

  } catch {
    res.status(500).json([]);
  }
});

/* ===============================
   CREATE POST
================================ */
app.post("/api/posts", authenticateToken, async (req, res) => {
  try {

    const { content } = req.body;

    if (!content) {
      return res.json({
        success: false,
        message: "Content required"
      });
    }

    const user = await User.findById(req.user.id);

    const post = new Post({
      content,
      authorName: `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      date: new Date(),
      likes: 0
    });

    await post.save();

    res.json({
      success: true,
      post
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false
    });
  }
});

/* ===============================
   MESSAGES
================================ */
app.get("/api/messages", async (req, res) => {
  try {

    const messages = await Message.find().sort({ createdAt: 1 });

    res.json(messages);

  } catch {
    res.status(500).json({
      message: "Server error"
    });
  }
});

/* ===============================
   LOGOUT
================================ */
app.post("/api/users/logout", (req, res) => {
  res.json({ success: true });
});

/* ===============================
   SPA FALLBACK
================================ */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===============================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on https://ahoreda-backend.onrender.com`);
    });

  })
  .catch(err => {
    console.log("MongoDB error ❌", err);
  });