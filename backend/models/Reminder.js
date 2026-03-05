

import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicine: { type: String, required: true },
  times: [{ type: String, required: true }],

  repeat: { type: String, enum: ["none", "daily", "weekly"], default: "none" },
startDate: { type: Date, default: Date.now },
active: { type: Boolean, default: true },

  
  status: [{ type: String, enum: ["taken", "missed", "pending"], default: "pending" }],
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);





