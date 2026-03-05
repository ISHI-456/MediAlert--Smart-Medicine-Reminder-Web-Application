
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      familyName,
      familyEmail,
      familyPhone,
      email,
      password,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      patientName,
      patientEmail,
      patientPhone,
      familyName,
      familyEmail,
      familyPhone,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        patientName: user.patientName,
        patientEmail: user.patientEmail,
        patientPhone: user.patientPhone,
        familyName: user.familyName,
        familyEmail: user.familyEmail,
        familyPhone: user.familyPhone,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

// 📌 SIGN IN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        patientName: user.patientName,
        patientEmail: user.patientEmail,
        patientPhone: user.patientPhone,
        familyName: user.familyName,
        familyEmail: user.familyEmail,
        familyPhone: user.familyPhone,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
