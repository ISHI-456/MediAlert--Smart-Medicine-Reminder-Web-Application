import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";   // ✅ Needed for navigation
import API from "../api";

function AuthPage({ onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate(); // ✅ hook

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    familyName: "",
    familyEmail: "",
    familyPhone: "",
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // ⬅ Sign Up API call
        const res = await API.post("/auth/signup", formData);
        alert("Sign Up Successful!");
        console.log("Saved to MongoDB:", res.data);

        // ✅ Save token after signup
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/"); // Go to dashboard
      } else {
        // ⬅ Sign In API call
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        alert("Sign In Successful!");

        // ✅ Save token after login
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        console.log("Fetched from MongoDB:", res.data);

        navigate("/"); // Go to dashboard
      }

      if (onSuccess) onSuccess(); // optional callback
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-pink-400">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
              >
                {/* Patient Details */}
                <h3 className="text-lg font-semibold mb-2">Patient Details</h3>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />
                <input
                  type="email"
                  name="patientEmail"
                  placeholder="Patient Email"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />
                <input
                  type="tel"
                  name="patientPhone"
                  placeholder="Patient Phone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />

                {/* Family Details */}
                <h3 className="text-lg font-semibold mb-2 mt-4">
                  Family Member
                </h3>
                <input
                  type="text"
                  name="familyName"
                  placeholder="Family Member Name"
                  value={formData.familyName}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />
                <input
                  type="email"
                  name="familyEmail"
                  placeholder="Family Member Email"
                  value={formData.familyEmail}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />
                <input
                  type="tel"
                  name="familyPhone"
                  placeholder="Family Member Phone"
                  value={formData.familyPhone}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />

                {/* Common fields */}
                <input
                  type="email"
                  name="email"
                  placeholder="Login Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition"
                >
                  Sign Up
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-slate-800"
                  required
                />

                <div className="flex items-center mb-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="accent-pink-500"
                    />
                    Remember Me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition"
                >
                  Sign In
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Switch Button */}
          <p className="mt-4 text-center text-gray-400 text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsSignUp(false)}
                  className="text-pink-400 hover:underline cursor-pointer"
                >
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => setIsSignUp(true)}
                  className="text-pink-400 hover:underline cursor-pointer"
                >
                  Sign Up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
