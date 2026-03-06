const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { 
    day: Number,
    month: Number,
    year: Number
  },
  gender: { type: String, required: true },
  country: { type: String, required: true },
  emailPhone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" }, // base64 or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);