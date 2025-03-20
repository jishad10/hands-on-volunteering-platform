import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { joinTeamSuccess, leaveTeamSuccess } from "../../redux/team/teamSlice";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const token = currentUser?.token || localStorage.getItem("authToken");
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!token) {
        setMessage("❌ No token found. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/teams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch team details");
        }

        setTeam(data?.data || null);
      } catch (error) {
        console.error("Error fetching team details:", error);
        setMessage("❌ Failed to load team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id, navigate, token]);

  const handleJoinTeam = async () => {
    if (!token) {
      setMessage("❌ Please log in to join the team.");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/teams/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join the team");
      }

      setTeam(data?.data);
      dispatch(joinTeamSuccess(data?.data));
      setMessage("✅ Successfully joined the team!");
    } catch (error) {
      console.error("Error joining team:", error);
      setMessage("❌ Failed to join the team.");
    } finally {
      setProcessing(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!token) {
      setMessage("❌ Please log in to leave the team.");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/teams/${id}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to leave the team");
      }

      setTeam(data?.data);
      dispatch(leaveTeamSuccess(data?.data));
      setMessage("✅ Successfully left the team!");
    } catch (error) {
      console.error("Error leaving team:", error);
      setMessage("❌ Failed to leave the team.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 text-lg font-semibold">
        ⏳ Loading team details...
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center mt-5 text-red-500 text-lg font-semibold">
        ❌ Team not found.
      </div>
    );
  }

  const isMember = team.members?.some((member) => member._id === userId);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-white shadow-lg rounded-xl mt-10">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">{team.name}</h2>
      </div>

      <div className="space-y-5 bg-white p-4 rounded-lg shadow-md">
        <p className="text-lg font-semibold text-gray-700">
          📢 Team Leader:{" "}
          <span className="text-gray-600">{team.leader?.name || "Unknown"}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          📜 Description: <span className="text-gray-600">{team.description}</span>
        </p>

        <h3 className="text-xl font-semibold text-gray-800">
          👥 Members ({team.members?.length || 0})
        </h3>

        <div className="flex items-center space-x-4 mt-4">
          {isMember ? (
            <button
              onClick={handleLeaveTeam}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50"
              disabled={processing}
            >
              {processing ? "Leaving..." : "🚪 Leave Team"}
            </button>
          ) : (
            <button
              onClick={handleJoinTeam}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50"
              disabled={processing}
            >
              {processing ? "Joining..." : "➕ Join Team"}
            </button>
          )}
        </div>

        {message && <p className="text-center text-red-500 mt-3">{message}</p>}
      </div>
    </div>
  );
}
