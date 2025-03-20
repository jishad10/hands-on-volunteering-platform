import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addHelpRequestStart,
  createHelpRequestSuccess,
  createHelpRequestFailure,
} from "../../redux/help/helpRequestSlice";
import "react-toastify/dist/ReactToastify.css";

export default function CreateHelp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector((state) => state.helpRequests || {});
  const { currentUser } = useSelector((state) => state.user || {});

  const token = currentUser?.token || localStorage.getItem("authToken");

  const [helpData, setHelpData] = useState({
    title: "",
    description: "",
    urgencyLevel: "low",
  });

  const handleChange = (e) => {
    setHelpData({ ...helpData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("❌ Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    dispatch(addHelpRequestStart());

    try {
      const response = await fetch("http://localhost:8000/api/v1/helps/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(helpData),
      });

      const result = await response.json();

      if (response.ok) {
        dispatch(createHelpRequestSuccess(result.data));
        toast.success("✅ Help request created successfully!");

        setTimeout(() => {
          navigate("/community-help");
        }, 500);
      } else {
        dispatch(createHelpRequestFailure(result.message || "❌ Failed to create request."));
        toast.error(result.message || "❌ Failed to create request.");
      }
    } catch (error) {
      console.error("Error creating help request:", error);
      dispatch(createHelpRequestFailure("Something went wrong"));
      toast.error("❌ Something went wrong.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5">🤝 Request Help</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">🆘 Title:</label>
          <input
            type="text"
            name="title"
            value={helpData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter request title..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">📝 Description:</label>
          <textarea
            name="description"
            value={helpData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mt-1"
            placeholder="Describe your help request..."
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-medium">⚡ Urgency Level:</label>
          <select
            name="urgencyLevel"
            value={helpData.urgencyLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded-lg text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "✅ Submit Help Request"}
        </button>
      </form>
    </div>
  );
}
