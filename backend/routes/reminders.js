// backend/routes/reminders.js
import express from "express";
import Reminder from "../models/Reminder.js";
import { verifyToken } from "../middleware/auth.js";


import { getTodayReminders } from "../controllers/reminderController.js";








const router = express.Router();


router.post("/", verifyToken, async (req, res) => {
  try {
    const { medicine, times, repeat, startDate } = req.body;

    if (!medicine || !times || !Array.isArray(times)) {
      return res.status(400).json({ message: "Medicine and times are required" });
    }

    const newReminder = new Reminder({
      medicine,
      times,
      status: times.map(() => "pending"),
      userId: req.user.id,
      repeat: repeat || "none",
      startDate: startDate || new Date(),
      active: true,
    });

    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(500).json({ message: "Failed to add reminder." });
  }
});

// ================================
// 2️⃣ Get reminder history

router.get("/history", verifyToken, async (req, res) => {
  try {
    console.log("Fetching history for user:", req.user.id);
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    console.error("Error fetching reminder history:", err);
    res.status(500).json({ message: "Failed to fetch reminder history" });
  }
});

// ================================
// 3️⃣ Get today's reminders
// GET /api/reminders/today
router.get("/today", verifyToken, getTodayReminders);





// ================================
// 4️⃣ Get medicine stock
// GET /api/reminders/stock
router.get("/stock", verifyToken, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });

    const stock = reminders.map((r) => ({
      medicine: r.medicine,
      doses: r.times.length - (r.status?.filter((s) => s === "taken").length || 0),
    }));

    res.json(stock);
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ message: "Failed to fetch stock." });
  }
});

router.get("/taken/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
    const reminder = await Reminder.findById(id);
    if (!reminder) return res.status(404).send("Reminder not found");

    reminder.status[index] = "taken";
    await reminder.save();

    res.send("✅ Medicine marked as taken. Thank you!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating reminder status");
  }
});


// PATCH /api/reminders/:id/status
router.patch("/:id/status", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { index, status } = req.body;
  try {
    const reminder = await Reminder.findOne({ _id: id, userId: req.user.id });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    reminder.status[index] = status;
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const reminder = await Reminder.findByIdAndDelete(id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    res.json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
});


// ================================
// 5️⃣ Weekly progress chart
// GET /api/reminders/chart
router.get("/chart", verifyToken, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayReminders = reminders.filter(
        (r) => r.createdAt >= dayStart && r.createdAt < dayEnd
      );

      const taken = dayReminders.reduce(
        (acc, r) => acc + (r.status?.filter((s) => s === "taken").length || 0),
        0
      );
      const missed = dayReminders.reduce(
        (acc, r) => acc + (r.status?.filter((s) => s === "missed").length || 0),
        0
      );

      chartData.push({
        name: day.toLocaleDateString("en-US", { weekday: "short" }),
        taken,
        missed,
      });
    }

    res.json(chartData);
  } catch (err) {
    console.error("Error fetching weekly chart:", err);
    res.status(500).json({ message: "Failed to fetch weekly chart." });
  }
});

export default router;
