import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/events/search?query=${query}`);
      const data = await response.json();
      setEvents(data?.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(searchQuery);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading events...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">📅 Upcoming Volunteer Events</h2>
        <Link
          to="/create-events"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          + Create Event
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-5 flex gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          🔍 Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event._id}
              className="p-5 border rounded-lg shadow-md bg-white transition transform hover:scale-105 hover:shadow-lg"
            >
              <h3 className="font-semibold text-xl text-gray-800">📌 {event.title}</h3>
              <p className="text-gray-600 mt-2 flex items-center">
                📅 {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-gray-700 flex items-center mt-1">🌍 {event.location}</p>
              <p className="text-sm text-gray-500 mt-1">
                📢 Organized by: {event.createdBy?.name || "Unknown"}
              </p>

              {/* View Details Link */}
              <div className="mt-4">
                <Link
                  to={`/events/${event._id}`}
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  📄 View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No events available.</p>
        )}
      </div>
    </div>
  );
}