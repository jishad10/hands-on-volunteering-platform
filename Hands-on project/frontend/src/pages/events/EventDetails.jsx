import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");

  const token = currentUser?.token || localStorage.getItem("authToken");

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!token) {
        setMessage("❌ No token found. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEvent(data?.data || null);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setMessage("❌ Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate, token]);

  const handleJoinEvent = async () => {
    if (!token) {
      setMessage("❌ No token found. Please log in again.");
      navigate("/login");
      return;
    }

    setJoining(true);
    setMessage("");

    try {
      const response = await fetch(`http://localhost:8000/api/v1/events/${id}/attend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Successfully joined the event!");
        setEvent((prev) => ({
          ...prev,
          attendees: [...(prev?.attendees || []), currentUser?.name || "New User"],
        }));
      } else {
        setMessage(`❌ ${data.message || "Failed to join event"}`);
      }
    } catch (error) {
      console.error("Error joining event:", error);
      setMessage("❌ Failed to join event");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5 text-lg font-semibold">⏳ Loading event details...</div>;
  }

  if (!event) {
    return <div className="text-center mt-5 text-red-500 text-lg font-semibold">❌ Event not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-xl mt-10">
      {/* Event Header */}
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">{event.title}</h2>
      </div>

      {/* Event Details */}
      <div className="space-y-5 bg-white p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold text-gray-700">📅 Date: <span className="text-gray-600">{new Date(event.date).toLocaleDateString()}</span></p>
          <p className="text-lg font-semibold text-gray-700">🕒 Time: <span className="text-gray-600">{new Date(event.date).toLocaleTimeString()}</span></p>

          <p className="text-lg font-semibold text-gray-700">🌍 Location: <span className="text-gray-600">{event.location}</span></p>
          <p className="text-lg font-semibold text-gray-700">📢 Organized by: <span className="text-gray-600">{event.createdBy?.name || "Unknown"}</span></p>
          
        <h3 className="text-xl font-semibold text-gray-800">📜 Description</h3>
        <p className="text-gray-600 mt-2 leading-relaxed">{event.description}</p>
        <h3 className="text-xl font-semibold text-gray-800">👥 Attendees ({event.attendees?.length || 0})</h3>
      </div>

      {/* Join Event Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleJoinEvent}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-green-700"
          disabled={joining}
        >
          {joining ? "⏳ Joining..." : "✅ Join Event"}
        </button>
      </div>

      {/* Message Display */}
      {message && <p className="mt-5 text-center text-lg font-semibold text-blue-600">{message}</p>}
    </div>
  );
}
