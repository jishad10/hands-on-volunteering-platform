import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setHelpRequests } from "../../redux/help/helpRequestSlice";

export default function HelpRequests() {
  const dispatch = useDispatch();
  const { list: helpRequests } = useSelector((state) => state.helpRequests);

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/helps/");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch help requests");
        }

        console.log("Fetched help requests:", data?.data);
        dispatch(setHelpRequests(data?.data || []));
      } catch (error) {
        console.error("Error fetching help requests:", error);
      }
    };

    fetchHelpRequests();
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">🆘 Community Help Requests</h2>
        <Link
          to="/create-help-request"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          + Create Help Request
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {helpRequests.length > 0 ? (
          helpRequests.map((help) => {
            console.log("Rendering Help Request:", help);

            return (
              <div
                key={help._id}
                className="p-5 border rounded-lg shadow-md bg-white transition transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="font-semibold text-xl text-gray-800">
                  {help.urgencyLevel === "urgent" ? "🚨 Urgent: " : "🆗 "}
                  {help.title}
                </h3>
                <p className="text-gray-600 mt-2">📜 {help.description}</p>
                <p className="text-gray-700 mt-1">
                  🕒 Status: {help.status || "Open"}
                </p>
                <div className="mt-4">
                  <Link
                    to={`/helps/${help._id}`}
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
            No help requests available.
          </p>
        )}
      </div>
    </div>
  );
}
