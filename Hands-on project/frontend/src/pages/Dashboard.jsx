import React from "react";
import { useSelector } from "react-redux";
import { FaClock, FaCalendarCheck, FaStar, FaMedal, FaUsers, FaHandHoldingHeart } from "react-icons/fa";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-6">
        <img
          src={currentUser?.avatar || "https://via.placeholder.com/100"}
          alt="Avatar"
          className="w-20 h-20 rounded-full border-2 border-gray-300"
        />
        <div>
          <h1 className="text-2xl font-bold">{currentUser?.fullName || "Volunteer"}</h1>
          <p className="text-sm text-gray-600">{currentUser?.bio || "No bio available"}</p>
        </div>
      </div>
      
      {/* Impact Tracking */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2"><FaStar className="text-yellow-500" /> Your Impact</h2>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-100 rounded-lg">
            <FaClock className="text-blue-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{currentUser?.totalHours || 0}</p>
            <p className="text-sm">Total Hours</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <FaCalendarCheck className="text-green-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{currentUser?.volunteerHistory?.length || 0}</p>
            <p className="text-sm">Events Attended</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <FaMedal className="text-yellow-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{currentUser?.points || 0}</p>
            <p className="text-sm">Points Earned</p>
          </div>
        </div>
      </div>
      
      {/* Skills & Causes */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2"><FaHandHoldingHeart className="text-red-500" /> Your Interests</h2>
        <div className="mt-4">
          <p className="text-sm font-semibold">Skills:</p>
          <p className="text-gray-600">{currentUser?.skills?.join(", ") || "No skills added"}</p>
          <p className="text-sm font-semibold mt-2">Causes Supported:</p>
          <p className="text-gray-600">{currentUser?.causesSupported?.join(", ") || "No causes added"}</p>
        </div>
      </div>
      
      {/* Teams Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2"><FaUsers className="text-blue-500" /> Your Teams</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {currentUser?.teams?.length ? (
            currentUser.teams.map((team, index) => (
              <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                {team.name || "Team Name"}
              </li>
            ))
          ) : (
            <li className="text-gray-500">Not part of any team yet.</li>
          )}
        </ul>
      </div>
      
      {/* Recent Activity Feed */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">📰 Recent Activity</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {currentUser?.volunteerHistory?.length ? (
            currentUser.volunteerHistory.map((activity, index) => (
              <li key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                Attended {activity.event?.name || "an event"} - {activity.hours} hrs
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent activity yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;