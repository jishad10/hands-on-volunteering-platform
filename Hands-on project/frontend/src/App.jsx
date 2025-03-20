import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import Layout from "./components/Layout"; 
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/profile/ChangePassword";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/events/CreateEvent";
import EventDetails from "./pages/events/EventDetails";
import HelpRequest from "./pages/CommunityHelp/HelpRequest";
import CreateTeam from "./pages/team/CreateTeam";
import TeamDetails from "./pages/team/TeamDetails";
import Teams from "./pages/team/Teams";
import CreateHelp from "./pages/CommunityHelp/CreateHelp";
import HelpRequestDetails from "./pages/CommunityHelp/HelpRequestDetails";
import LogHours from "./pages/Volunteer/LogHours";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected routes inside Layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/volunteer-events" element={<Events />} />
                <Route path="/create-events" element={< CreateEvent />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/teams" element={<Teams/>} />
                <Route path="/teams/:id" element={<TeamDetails />} />
                <Route path="/community-help" element={<HelpRequest />} />
                <Route path="/create-team" element={<CreateTeam />} />
                <Route path="/create-help-request" element={<CreateHelp />} />
                <Route path="/helps/:id" element={<HelpRequestDetails />} />
                <Route path="/log-hours" element={<LogHours />} />
              </Route>
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}