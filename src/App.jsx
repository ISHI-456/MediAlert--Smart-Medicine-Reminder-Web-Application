    
import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddReminder from "./pages/AddReminder";
import ReminderHistory from "./pages/ReminderHistory";

function App() {
  const [stage, setStage] = useState("landing"); 
  // stages: landing | auth | dashboard

  return (
    <Router>
      {stage === "landing" && (
        <div className="relative h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background */}
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>

          <h1 className="text-6xl font-extrabold text-white relative z-10">
            Medi<span className="text-pink-400">Alert</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 italic relative z-10">
            Right time. Right dose. Right care.
          </p>

          <button
            onClick={() => setStage("auth")}
            className="mt-8 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-semibold shadow-lg relative z-10 transition transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      )}

      {stage === "auth" && <AuthPage onSuccess={() => setStage("dashboard")} />}

      {stage === "dashboard" && (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-reminder" element={<AddReminder />}/>
          <Route path="/history" element={<ReminderHistory />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
