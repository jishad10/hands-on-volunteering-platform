import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Calendar, Users, Heart, BarChart } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Volunteer Events", icon: Calendar, path: "/volunteer-events" },
    { name: "Team", icon: Users, path: "/teams" },
    { name: "Community Help", icon: Heart, path: "/community-help" },
    { name: "Impact Tracking", icon: BarChart, path: "/log-hours" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-200 text-white p-5 shadow-lg flex flex-col rounded-r-xl">
      <nav className="flex-1 mt-10">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 my-2 rounded-lg transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10 ${
                isActive ? "bg-white/20 text-white shadow-md" : ""
              }`
            }
          >
            <Icon className="w-5 h-5 opacity-80" />
            <span className="font-medium">{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
