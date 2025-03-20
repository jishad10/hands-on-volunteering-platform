import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateHelpRequestParticipants } from "../../redux/help/helpRequestSlice";

export default function HelpRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [helpRequest, setHelpRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");

  const token = currentUser?.token || localStorage.getItem("authToken");
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchHelpRequestDetails = async () => {
      if (!token) {
        setMessage("❌ No token found. Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/helps/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch help request details");
        }

        setHelpRequest(data?.data || null);
      } catch (error) {
        console.error("Error fetching help request details:", error);
        setMessage("❌ Failed to load help request details");
      } finally {
        setLoading(false);
      }
    };

    fetchHelpRequestDetails();
  }, [id, navigate, token]);

  // Compute isParticipant dynamically
  const isParticipant = helpRequest?.participants?.some((p) => p._id === userId);

  const handleJoinRequest = async () => {
    if (!token) {
      setMessage("❌ Please log in to join the request.");
      return;
    }
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/helps/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to join the request");
      }
      setHelpRequest(data?.data);
      dispatch(updateHelpRequestParticipants({ id, participants: data?.data?.participants }));
      setMessage("✅ Successfully joined the help request!");
    } catch (error) {
      setMessage("❌ Failed to join the request.");
    } finally {
      setProcessing(false);
    }
  };

  const handleLeaveRequest = async () => {
    if (!token) {
      setMessage("❌ Please log in to leave the request.");
      return;
    }
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/helps/${id}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to leave the request");
      }
      setHelpRequest(data?.data);
      dispatch(updateHelpRequestParticipants({ id, participants: data?.data?.participants }));
      setMessage("✅ Successfully left the help request!");
    } catch (error) {
      setMessage("❌ Failed to leave the request.");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await fetch(`http://localhost:8000/api/v1/helps/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: comment }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add comment");
      }
      setHelpRequest(data?.data);
      setComment("");
      setMessage("✅ Comment added successfully!");
    } catch (error) {
      setMessage("❌ Failed to add comment.");
    }
  };

  if (loading) return <div className="text-center mt-5">⏳ Loading help request...</div>;
  if (!helpRequest) return <div className="text-center text-red-500">❌ Help request not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900">{helpRequest.title}</h2>
      <p className="mt-2 text-gray-700">📜 {helpRequest.description}</p>
      <p className="mt-2 text-gray-600 font-medium">📌 Status: <span className="font-semibold">{helpRequest.status}</span></p>
      <p className="mt-2 text-gray-600 font-medium">⏳ Urgency Level: <span className="font-semibold">{helpRequest.urgencyLevel}</span></p>

      <div className="mt-4">
        {isParticipant ? (
          <button
            onClick={handleLeaveRequest}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            disabled={processing}
          >
            🚪 Leave Request
          </button>
        ) : (
          <button
            onClick={handleJoinRequest}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            disabled={processing}
          >
            ➕ Join Request
          </button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">💬 Comments</h3>
        <div className="mt-4 space-y-4">
          {helpRequest.comments?.length > 0 ? (
            helpRequest.comments.map((c, index) => (
              <div key={index} className="flex gap-3 p-3 bg-gray-100 rounded-lg shadow-sm items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 shadow-md">
                  <img
                    src={`https://robohash.org/${encodeURIComponent(c.user)}.png?size=50x50&set=set3`}
                    alt={c.user}
                    className="w-full h-full object-cover"
                  />

                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{c.user}</p>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-2 text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3 border-t pt-4">
        <input
          type="text"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          ➡️ Post
        </button>
      </div>
      {message && <p className="text-center text-red-500 mt-3">{message}</p>}
    </div>
  );
}
