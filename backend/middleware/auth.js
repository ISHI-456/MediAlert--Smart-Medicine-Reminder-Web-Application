// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // make sure you have a User model

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
