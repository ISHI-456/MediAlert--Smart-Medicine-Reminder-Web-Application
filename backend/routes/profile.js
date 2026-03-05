import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js"; // JWT middleware

const router = express.Router();

// GET user profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE user profile
router.put("/", verifyToken, async (req, res) => {
  try {
    const updates = { ...req.body };

    // If password is updated, hash it (optional)
    if (updates.password && updates.password !== "********") {
      // Use bcrypt if hashing
      // const salt = await bcrypt.genSalt(10);
      // updates.password = await bcrypt.hash(updates.password, salt);
    } else {
      delete updates.password; // keep password unchanged if not modified
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
