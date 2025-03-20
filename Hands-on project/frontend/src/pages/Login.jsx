import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    toast.error("Please fill in all fields!");
    return;
  }

  setLoading(true);
  dispatch(signInStart());

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    console.log("Raw Response:", response);
    const data = await response.json();
    console.log("Parsed Data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Invalid email or password");
    }

    const user = data.user || data.data?.user; 
    const token = data.accessToken || data.data?.accessToken; 

    if (!user || !token) {
      throw new Error("User or token missing from API response!");
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify({ ...user, token }));

    dispatch(signInSuccess({ ...user, token }));

    toast.success("Login successful!");
    setTimeout(() => navigate("/dashboard", { replace: true }), 500);
  } catch (error) {
    dispatch(signInFailure(error.message));
    toast.error(error.message);
    console.error("Login Error:", error.message);
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-xl p-6 w-full max-w-2xl border border-white/20 bg-gradient-to-br from-blue-300 to-blue-100">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="pl-12 py-3 w-full bg-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              aria-label="Email Address"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-12 py-3 w-full bg-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              aria-label="Password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
