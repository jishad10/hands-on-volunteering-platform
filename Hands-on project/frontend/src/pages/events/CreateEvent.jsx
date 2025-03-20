import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    registrationDeadline: "",
    maxAttendees: "",
    visibility: "public",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { title, description, category, location, date, registrationDeadline } = formData;

    if (!title.trim() || !description.trim() || !category.trim() || !location.trim()) {
      setError("Please fill in all required fields.");
      return false;
    }

    const eventDate = new Date(date);
    const regDeadline = new Date(registrationDeadline);
    const now = new Date();

    if (isNaN(eventDate.getTime())) {
      setError("Invalid event date.");
      return false;
    }

    if (eventDate < now) {
      setError("Event date cannot be in the past.");
      return false;
    }

    if (registrationDeadline && regDeadline > eventDate) {
      setError("Registration deadline must be before the event date.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/v1/events`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      setSuccess("Event created successfully!");
      setTimeout(() => setSuccess(null), 3000); 

      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
        registrationDeadline: "",
        maxAttendees: "",
        visibility: "public",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create an Event</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700">Event Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Event Description *</label>
          <textarea
            name="description"
            placeholder="Enter event details"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700">Category *</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Health, Education"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700">Location *</label>
          <input
            type="text"
            name="location"
            placeholder="Enter event location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-gray-700">Event Date *</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Registration Deadline */}
        <div>
          <label className="block text-gray-700">Registration Deadline</label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Max Attendees */}
        <div>
          <label className="block text-gray-700">Max Attendees (Optional)</label>
          <input
            type="number"
            name="maxAttendees"
            placeholder="Number of attendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-gray-700">Visibility</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
