import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    bio: "",
    skills: "",
    causesSupported: "",
    role: "user",
    avatar: null,
    coverImage: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    } else if (e.target.name === "coverImage") {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.username || !formData.password || !formData.avatar) {
      toast.error("Please fill in all required fields and upload an avatar!");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("skills", JSON.stringify(formData.skills.split(",").map(skill => skill.trim())));
      formDataToSend.append("causesSupported", JSON.stringify(formData.causesSupported.split(",").map(cause => cause.trim())));
      formDataToSend.append("role", formData.role);
      if (formData.avatar) formDataToSend.append("avatar", formData.avatar);
      if (formData.coverImage) formDataToSend.append("coverImage", formData.coverImage);

      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("User registered successfully!");

      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: "",
        bio: "",
        skills: "",
        causesSupported: "",
        role: "user",
        avatar: null,
        coverImage: null,
      });

      setAvatarPreview(null);
      setCoverPreview(null);

      document.getElementById("avatarInput").value = "";
      document.getElementById("coverInput").value = "";

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-xl p-6 w-full max-w-2xl border border-white/20 bg-gradient-to-br from-blue-300 to-blue-100">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">Join the Community</h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
            <FaUser className="absolute left-4 top-3 text-gray-400" />
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="pl-12 py-3 w-full bg-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3 text-gray-400" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="pl-12 py-3 w-full bg-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <FaUser className="absolute left-4 top-3 text-gray-400" />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="pl-12 py-3 w-full bg-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-3 text-gray-400" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="pl-12 py-3 w-full bg-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <textarea name="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} className="w-full bg-white/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>

          <input type="text" name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} className="w-full bg-white/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />

          <input type="text" name="causesSupported" placeholder="Causes Supported" value={formData.causesSupported} onChange={handleChange} className="w-full bg-white/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" />


          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
 
          {/* Avatar Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Upload Avatar</label>
            <input type="file" id="avatarInput" name="avatar" onChange={handleFileChange} className="w-full" />
            {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-16 h-16 rounded-full" />}
          </div>

          {/* Cover Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Upload Cover Image (Optional)</label>
            <input type="file" id="coverInput" name="coverImage" onChange={handleFileChange} className="w-full" />
            {coverPreview && <img src={coverPreview} alt="Cover Preview" className="w-32 h-16 object-cover rounded-md" />}
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
