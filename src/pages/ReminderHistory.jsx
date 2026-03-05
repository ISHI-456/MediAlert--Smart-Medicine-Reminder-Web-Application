import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function ReminderHistory() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError("You are not logged in!");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await API.get("/reminders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load reminder history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const handleDelete = async (reminderId) => {
  if (!window.confirm("Are you sure you want to delete this reminder?")) return;

  try {
    await API.delete(`/reminders/${reminderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setHistory((prev) => prev.filter((r) => r._id !== reminderId));
  } catch (err) {
    console.error("Failed to delete reminder:", err);
    alert("Failed to delete reminder. Check console.");
  }
};


  const handleStatusChange = async (reminderId, index, newStatus) => {
    try {
      // Send PATCH request to backend to update status
      await API.patch(
        `/reminders/${reminderId}/status`,
        { index, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setHistory((prev) =>
        prev.map((r) =>
          r._id === reminderId
            ? { ...r, status: r.status.map((s, i) => (i === index ? newStatus : s)) }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Check console.");
    }
  };



  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Reminder History</h1>

      {loading && <p className="text-gray-400">Loading reminders...</p>}
      {error && !loading && <p className="text-red-500 font-semibold">{error}</p>}

      {!loading && !error && history.length === 0 ? (
        <p className="text-gray-400">No reminders found.</p>
      ) : (
        !loading &&
        !error && (
          <div className="bg-slate-900 p-6 rounded-xl shadow-lg overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className=" text-pink-400">
                  <th className="px-4 py-2">Medicine</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Status</th>
                  
                  
                    <th className="px-4 py-2">Created on</th>
                        
                  
                  

                </tr>
              </thead>
              <tbody>
                {history.map((r) =>
                  r.times.map((t, i) => (
                    <tr key={`${r._id}-${i}`} className="border-b border-slate-700">
                      <td className="px-4 py-2">{r.medicine}</td>
                      <td className="px-4 py-2">{t}</td>
                      <td className="px-4 py-2">
                        <select
                          className={`px-3 py-1 rounded-full text-sm ${r.status && r.status[i] === "taken"
                              ? "bg-green-600"
                              : r.status && r.status[i] === "missed"
                                ? "bg-red-600"
                                : "bg-yellow-600"
                            }`}
                          value={r.status[i] || "pending"}
                          onChange={(e) =>
                            handleStatusChange(r._id, i, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="taken">Taken</option>
                          <option value="missed">Missed</option>
                        </select>
                        
                        
                      </td>
                      <td className="px-4 py-2 text-gray-400 text-sm ">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>

                       {/* Delete button */}
                      
                        <button
                          className="bg-red-600 px-4 py-1 mx-40 my-4 rounded text-white hover:bg-red-700"
                          onClick={() => handleDelete(r._id)}
                        >
                          Delete
                        </button>
                        
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition block mx-auto"
      > 
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default ReminderHistory;
