import Reminder from "../models/Reminder.js";




export const getTodayReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const reminders = await Reminder.find({
      userId,
      active: true,
      $or: [
        // Reminders that start today
        { startDate: { $gte: startOfToday, $lte: endOfToday } },

        // Daily repeat reminders (started before today)
        { repeat: "daily", startDate: { $lte: endOfToday } },

        // Weekly repeat reminders (same weekday)
        {
          repeat: "weekly",
          startDate: { $lte: endOfToday },
        },
      ],
    });

    // Filter weekly reminders to match today's weekday
    const filtered = reminders.filter((r) => {
      if (r.repeat === "weekly") {
        const reminderDay = new Date(r.startDate).getDay();
        const todayDay = new Date().getDay();
        return reminderDay === todayDay;
      }
      return true;
    });

    res.json(filtered);
  } catch (err) {
    console.error("Error fetching today's reminders:", err);
    res.status(500).json({ message: "Server error while fetching today's reminders." });
  }
};
