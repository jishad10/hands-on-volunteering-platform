import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-3xl w-full bg-white/70 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-gray-200 transition-all hover:shadow-lg lg:mt-3" >
        {/* Profile Header */}
        <div className="flex flex-col items-center border-b pb-4">
          <img
            src={currentUser.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 shadow-md transition-transform duration-300 hover:scale-105"
          />
          <h2 className="text-2xl font-bold text-gray-900 mt-3">{currentUser.fullName}</h2>
          <p className="text-gray-500 text-sm">@{currentUser.username}</p>
        </div>

        {/* User Details */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p><strong className="text-gray-900">📧 Email:</strong> {currentUser.email}</p>
            <p><strong className="text-gray-900">📝 Bio:</strong> {currentUser.bio || "No bio available"}</p>
          </div>
          <div className="space-y-2">
            <p><strong className="text-gray-900">💼 Skills:</strong> {currentUser.skills.join(", ")}</p>
            <p><strong className="text-gray-900">🎗️ Causes Supported:</strong> {currentUser.causesSupported.join(", ")}</p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-4 flex justify-center gap-3">
          <Link to="/edit-profile">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm">
              ✏️ Edit Profile
            </button>
          </Link>

          <Link to="/change-password">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-sm">
              🔑 Change Password
            </button>
          </Link>
        </div>

        {/* Volunteer History */}
        <div className="mt-5">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">📜 Volunteer History</h3>
          {currentUser.volunteerHistory.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {currentUser.volunteerHistory.map((event, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-sm"
                >
                  <span className="font-semibold">{event.name}</span> - {event.hours} hrs ({event.status})
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center">No volunteer history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
