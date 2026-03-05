import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AddReminder() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🧠 1️⃣ Add repeat field here in the state
  const [formData, setFormData] = useState({
    medicine: "",
    times: [""], // can add multiple times
    repeat: "daily", // <-- NEW FIELD
    
  });

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const newTimes = [...formData.times];
      newTimes[index] = e.target.value;
      setFormData({ ...formData, times: newTimes });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addTimeField = () => {
    setFormData({ ...formData, times: [...formData.times, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in!");
      return;
    }

    // 🧩 2️⃣ Create the reminder object (optional, but clean)
    const newReminder = {
      medicine: formData.medicine,
      times: formData.times,
      repeat: formData.repeat,
      
    };

    try {
      await API.post("/reminders", newReminder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reminder added successfully ✅");
      navigate("/");
    } catch (err) {
      console.error("Error adding reminder:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-xl shadow-lg space-y-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-pink-400">Add Reminder</h2>

        {/* Medicine Name */}
        <input
          type="text"
          name="medicine"
          placeholder="Medicine Name"
          value={formData.medicine}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-800"
          required
        />

        {/* Time Inputs */}
        {formData.times.map((time, index) => (
          <input
            key={index}
            type="time"
            value={time}
            onChange={(e) => handleChange(e, index)}
            className="w-full p-2 rounded bg-slate-800"
            required
          />
        ))}

        {/* Add Another Time */}
        <button
          type="button"
          onClick={addTimeField}
          className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          + Add Time
        </button>

        {/* 🕒 Repeat Option */}
        <select
          name="repeat"
          className="p-2 rounded bg-slate-800 text-white w-full"
          value={formData.repeat}
          onChange={handleChange}
        >
          <option value="daily">Repeat Daily</option>
          <option value="weekly">Repeat Weekly</option>
          <option value="none">Do Not Repeat</option>
        </select>

          
        {/* Save Button */}
        <button
          type="submit"
          className="bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 w-full"
        >
          Save Reminder
        </button>
      </form>
    </div>
  );
}

export default AddReminder;
