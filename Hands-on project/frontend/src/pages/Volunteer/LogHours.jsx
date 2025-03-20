import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; 
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LogHours = () => {
  const { currentUser } = useSelector((state) => state.user); 
  const token = currentUser?.token || localStorage.getItem("authToken");

  const [activeTab, setActiveTab] = useState("log");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [logs, setLogs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.warn("No auth token found. Redirect to login or show a message.");
        return;
      }

      setFetching(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [eventsRes, logsRes, leaderboardRes, certificatesRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/v1/events`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/volunteer/my-logs`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/volunteer/leaderboard`, { headers }),
          axios.get(`${API_BASE_URL}/api/v1/volunteer/certificates`, { headers }),
        ]);

        if (eventsRes.status === "fulfilled") setEvents(Array.isArray(eventsRes.value.data) ? eventsRes.value.data : []);
        if (logsRes.status === "fulfilled") setLogs(Array.isArray(logsRes.value.data) ? logsRes.value.data : []);
        if (leaderboardRes.status === "fulfilled") setLeaderboard(Array.isArray(leaderboardRes.value.data) ? leaderboardRes.value.data : []);
        if (certificatesRes.status === "fulfilled") setCertificates(Array.isArray(certificatesRes.value.data) ? certificatesRes.value.data : []);

      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !hours) {
      setMessage({ type: "error", text: "Please select an event and enter hours." });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/volunteer/log`,
        { event: selectedEvent, hours: Number(hours) },
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      setMessage({ type: "success", text: "Hours logged successfully!" });
      setSelectedEvent("");
      setHours("");

      const logsRes = await axios.get(`${API_BASE_URL}/api/v1/volunteer/my-logs`, { headers: { Authorization: `Bearer ${token}` } });
      setLogs(logsRes.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to log hours. Try again." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-4">Volunteer Dashboard</h2>

      {/* Show message if not logged in */}
      {!token && <p className="text-red-500 text-center">You must be logged in to access this page.</p>}

      <div className="flex space-x-4 mb-4 border-b">
        {["log", "logs", "leaderboard", "certificates"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${activeTab === tab ? "border-b-2 border-blue-600" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {message && (
        <p className={`text-center p-2 rounded ${message.type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
          {message.text}
        </p>
      )}

      {fetching ? (
        <p className="text-center p-4">Loading...</p>
      ) : (
        <>
          {activeTab === "log" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Select Event</label>
                <select className="w-full p-2 border rounded" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
                  <option value="">-- Choose an event --</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Hours Volunteered</label>
                <input type="number" className="w-full p-2 border rounded" value={hours} onChange={(e) => setHours(e.target.value)} min="1" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400" disabled={loading}>
                {loading ? "Logging..." : "Submit Hours"}
              </button>
            </form>
          )}

          {activeTab === "logs" && logs.length > 0 ? (
            logs.map((log) => (
              <li key={log._id} className="p-2 bg-gray-100 rounded">
                {log.event?.title || "Unknown Event"} - {log.hours} hours ({log.verified ? "Verified" : "Pending"})
              </li>
            ))
          ) : (
            <p>No logs available.</p>
          )}

          {activeTab === "leaderboard" && leaderboard.length > 0 ? (
            leaderboard.map((user, index) => (
              <li key={user._id} className="p-2 bg-gray-100 rounded">
                {index + 1}. {user.name} - {user.totalHours} hours
              </li>
            ))
          ) : (
            <p>No leaderboard data available.</p>
          )}

          {activeTab === "certificates" && certificates.length > 0 ? (
            certificates.map((cert) => (
              <li key={cert._id} className="p-2 bg-gray-100 rounded">
                {cert.title} - Earned on {new Date(cert.date).toLocaleDateString()}
              </li>
            ))
          ) : (
            <p>No certificates available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default LogHours;
