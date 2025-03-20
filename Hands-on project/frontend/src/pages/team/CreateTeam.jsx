import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addTeamStart,
  createTeamSuccess,
  createTeamFailure,
} from "../../redux/team/teamSlice";
import "react-toastify/dist/ReactToastify.css";

export default function CreateTeam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { list: teams = [], loading = false, error = null } = useSelector((state) => state.team || {});
  const { currentUser } = useSelector((state) => state.user || {});
  
  const token = currentUser?.token || localStorage.getItem("authToken");

  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    type: "public",
  });

  const handleChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("❌ Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    dispatch(addTeamStart());

    try {
      const response = await fetch("http://localhost:8000/api/v1/teams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teamData),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(createTeamSuccess(result.data));
        toast.success("✅ Team created successfully!");

        setTimeout(() => {
          navigate("/teams");
        }, 500);
      } else {
        dispatch(createTeamFailure(result.message || "❌ Failed to create team."));
        toast.error(result.message || "❌ Failed to create team.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      dispatch(createTeamFailure("Something went wrong"));
      toast.error("❌ Something went wrong.");
    }
  };

  useEffect(() => {
    if (teams.length > 0) {
      navigate("/teams");
    }
  }, [teams, navigate]);

  return (
    <div className="max-w-lg mx-auto p-5 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5">➕ Create New Team</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">🏷️ Team Name:</label>
          <input
            type="text"
            name="name"
            value={teamData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter team name..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">📝 Description:</label>
          <textarea
            name="description"
            value={teamData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter team description..."
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-medium">🔒 Team Type:</label>
          <select
            name="type"
            value={teamData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="public">🌍 Public</option>
            <option value="private">🔒 Private</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "✅ Create Team"}
        </button>
      </form>
    </div>
  );
}
