
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import schedule from "node-schedule";

import authRoutes from "./routes/auth.js";
import reminderRoutes from "./routes/reminders.js";
import profileRoutes from "./routes/profile.js";

import Reminder from "./models/Reminder.js";
import { sendSMS } from "./utils/sendSMS.js";
import User from "./models/User.js"; // ensure user model has phone + familyPhone fields

dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/profile", profileRoutes);

// ===============================
// MongoDB Connection + Server Start
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start Express server
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));

    // ===============================
    // Schedule job (run every minute)
    // ===============================
    schedule.scheduleJob("* * * * *", async () => {
      try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const reminders = await Reminder.find();

        for (const reminder of reminders) {
          for (let index = 0; index < reminder.times.length; index++) {
            const [hour, minute] = reminder.times[index].split(":").map(Number);

            // Match reminder time & still pending
            if (
              hour === currentHour &&
              minute === currentMinute &&
              reminder.status[index] === "pending"
            ) {
              const user = await User.findById(reminder.userId);
              if (!user) continue;

              const numbers = `${user.patientPhone},${user.familyPhone}`;
              const link = `${process.env.FRONTEND_URL}/reminder/taken/${reminder._id}/${index}`;
              const message = `⏰ Time to take your medicine: ${reminder.medicine}\n\n✅ Click here when taken: ${link}`;

              await sendSMS(numbers, message);
              console.log(`📨 SMS sent for reminder: ${reminder.medicine}`);
            }
          }
        }
      } catch (err) {
        console.error("❌ Error in reminder scheduler:", err);
      }
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
