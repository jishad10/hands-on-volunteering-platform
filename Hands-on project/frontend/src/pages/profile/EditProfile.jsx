import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../../redux/user/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || "",
    bio: currentUser.bio || "",
    skills: currentUser.skills.join(", ") || "",
    causesSupported: currentUser.causesSupported.join(", ") || "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      setTimeout(() => {
        setFormData({ ...formData, avatar: file });
        setImageLoading(false);
      }, 1000); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    setLoading(true);

    const updatedFormData = new FormData();
    updatedFormData.append("fullName", formData.fullName);
    updatedFormData.append("email", currentUser.email); 
    updatedFormData.append("bio", formData.bio);
    updatedFormData.append("skills", JSON.stringify(formData.skills.split(",").map(skill => skill.trim()))); 
    updatedFormData.append("causesSupported", JSON.stringify(formData.causesSupported.split(",").map(cause => cause.trim())));

    if (formData.avatar) {
      updatedFormData.append("avatar", formData.avatar);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/update-account`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: updatedFormData, 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(updateUserSuccess(data.data)); 
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
      
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" placeholder="Full Name" />
        
        <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" placeholder="Bio" rows="3"></textarea>
        
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" placeholder="Skills (comma separated)" />
        
        <input type="text" name="causesSupported" value={formData.causesSupported} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition" placeholder="Causes Supported (comma separated)" />

        <div className="flex items-center gap-4">
          <label className="block font-medium">Upload Avatar</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border border-gray-300 rounded-lg cursor-pointer" />
          {imageLoading && <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        <button type="submit" className={`w-full p-3 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>

      </form>
    </div>
  );
}
