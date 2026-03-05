
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PlusCircle, History, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [stock, setStock] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🕒 Added: Track current time (auto-updates every minute)
  const [currentTime, setCurrentTime] = useState(new Date());

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("You are not logged in!");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch today's reminders
        const resReminders = await API.get("/reminders/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders(resReminders.data);

        // Fetch stock
        const resStock = await API.get("/reminders/stock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStock(resStock.data);

        // Fetch weekly chart
        const resChart = await API.get("/reminders/chart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChartData(resChart.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response || err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 🕒 Added: update time every minute so reminders change from "Pending" → "Missed"
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      
      <div className="md:hidden flex justify-between items-center p-4 bg-slate-900">
        <h2 className="text-2xl font-bold text-pink-400">MediAlert</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

     
      <aside
        className={`
          bg-slate-900 p-6 flex flex-col
          w-full md:w-64 h-screen md:h-auto md:static fixed top-0 left-0 z-50
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          transition-transform duration-300
        `}
      >
        <h2 className="text-2xl font-bold mb-8 text-pink-400 hidden md:block">MediAlert</h2>
        <nav className="flex md:flex-col flex-row gap-4 md:gap-4">
          <button
            className="flex items-center gap-2 hover:text-pink-400"
            onClick={() => { navigate("/add-reminder"); setSidebarOpen(false); }}
          >
            <PlusCircle size={20} /> <span className="hidden md:inline">Add Reminder</span>
          </button>
          <button
            className="flex items-center gap-2 hover:text-pink-400"
            onClick={() => { navigate("/history"); setSidebarOpen(false); }}
          >
            <History size={20} /> <span className="hidden md:inline">Reminder History</span>
          </button>
          <button
            className="flex items-center gap-2 hover:text-pink-400"
            onClick={() => { navigate("/profile"); setSidebarOpen(false); }}
          >
            <User size={20} /> <span className="hidden md:inline">Edit Profile</span>
          </button>
        </nav>
      </aside>

      
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Welcome back 👋</h1>

        {loading && <p className="text-gray-400">Loading dashboard...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div className="flex flex-col space-y-6">
             
              <section className="bg-slate-900 p-4 md:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Today’s Reminders</h2>
                {reminders.length === 0 ? (
                  <p className="text-gray-400">No reminders for today.</p>
                ) : (
                  <ul className="space-y-2">
                    {reminders.map(r =>
                      r.times.map((t, i) => (
                        <li
                          key={`${r._id}-${i}`}
                          className="flex justify-between items-center bg-slate-800 p-2 md:p-3 rounded-lg"
                        >
                          <span>{r.medicine} - {t}</span>

                         
                          {(() => {
                            const now = currentTime;
                            const [hours, minutes] = t.split(":");
                            const reminderTime = new Date();
                            reminderTime.setHours(parseInt(hours), parseInt(minutes));

                            let displayStatus = "Pending";
                            let bgColor = "bg-yellow-500";

                            if (r.status[i] === "taken") {
                              displayStatus = "Taken";
                              bgColor = "bg-green-600";
                            } else if (now > reminderTime) {
                              displayStatus = "Missed";
                              bgColor = "bg-red-600";
                            }

                            return (
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${bgColor}`}
                              >
                                {displayStatus}
                              </span>
                            );
                          })()}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </section>

              <section className="bg-slate-900 p-4 md:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Medicine Stock</h2>
                {stock.length === 0 ? (
                  <p className="text-gray-400">No stock data available.</p>
                ) : (
                  <ul className="space-y-2">
                    {stock.map(s => (
                      <li
                        key={s.medicine}
                        className="flex justify-between items-center bg-slate-800 p-2 md:p-3 rounded-lg"
                      >
                        <span>{s.medicine}</span>
                        <span>{s.doses} doses left</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

           
            <div>
             
              <section className="bg-slate-900 p-4 md:p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
                {chartData.length === 0 ? (
                  <p className="text-gray-400">No weekly data available.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="taken" stackId="a" fill="#10b981" />
                      <Bar dataKey="missed" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
