
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    familyName: "",
    familyEmail: "",
    familyPhone: "",
    email: "",
    password: "********",
  });

  // Fetch user data from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/profile"); // GET /api/profile
        setFormData({
          patientName: response.data.patientName || "",
          patientEmail: response.data.patientEmail || "",
          patientPhone: response.data.patientPhone || "",
          familyName: response.data.familyName || "",
          familyEmail: response.data.familyEmail || "",
          familyPhone: response.data.familyPhone || "",
          email: response.data.email || "",
          password: "********", // don't show actual password
        });
      } catch (err) {
        console.error(err);
        alert("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      if (updatedData.password === "********") delete updatedData.password; // keep old password if unchanged

      const response = await API.put("/profile", updatedData);
      setFormData({
        ...response.data,
        password: "********", // hide password after update
      });
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSave}
        className="bg-slate-900 p-6 rounded-xl shadow-lg space-y-4 max-w-lg w-full"
      >
        <h2 className="text-xl font-semibold text-pink-400">Patient Details</h2>
        <input
          type="text"
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          className="w-full p-2 rounded bg-slate-800"
        />
        <input
          type="email"
          name="patientEmail"
          value={formData.patientEmail}
          onChange={handleChange}
          placeholder="Patient Email"
          className="w-full p-2 rounded bg-slate-800"
        />
        <input
          type="tel"
          name="patientPhone"
          value={formData.patientPhone}
          onChange={handleChange}
          placeholder="Patient Phone"
          className="w-full p-2 rounded bg-slate-800"
        />

        <h2 className="text-xl font-semibold text-pink-400">Family Member</h2>
        <input
          type="text"
          name="familyName"
          value={formData.familyName}
          onChange={handleChange}
          placeholder="Family Name"
          className="w-full p-2 rounded bg-slate-800"
        />
        <input
          type="email"
          name="familyEmail"
          value={formData.familyEmail}
          onChange={handleChange}
          placeholder="Family Email"
          className="w-full p-2 rounded bg-slate-800"
        />
        <input
          type="tel"
          name="familyPhone"
          value={formData.familyPhone}
          onChange={handleChange}
          placeholder="Family Phone"
          className="w-full p-2 rounded bg-slate-800"
        />

        <h2 className="text-xl font-semibold text-pink-400">Account</h2>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Account Email"
          className="w-full p-2 rounded bg-slate-800"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 rounded bg-slate-800"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
