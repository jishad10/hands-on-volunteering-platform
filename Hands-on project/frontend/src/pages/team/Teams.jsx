import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTeams } from "../../redux/team/teamSlice";
import { Link } from "react-router-dom";

export default function Teams() {
  const dispatch = useDispatch();
  const { list: teams } = useSelector((state) => state.teams);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/teams/");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch teams");
        }

        console.log("Fetched teams:", data?.data); 
        dispatch(setTeams(data?.data || []));
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">👥 Volunteer Teams</h2>
        <Link
          to="/create-team"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          + Create Team
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teams.length > 0 ? (
          teams.map((team) => {
            console.log("Rendering Team:", team); 

            return (
              <div
                key={team._id}
                className="p-5 border rounded-lg shadow-md bg-white transition transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="font-semibold text-xl text-gray-800">
                  {team.type === "public" ? "🌍 Public: " : "🔒 Private: "}
                  {team.name}
                </h3>
                <p className="text-gray-600 mt-2">📜 {team.description}</p>
                <p className="text-gray-700 mt-1">
                  👤 Members: {team.members?.length || 0}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/teams/${team._id}`}
                    className="text-blue-600 font-medium flex items-center hover:underline"
                  >
                    📄 View Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No teams available.
          </p>
        )}
      </div>
    </div>
  );
}
