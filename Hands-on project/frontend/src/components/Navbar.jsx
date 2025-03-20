import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <section className="max-w-[1280px] mx-auto flex items-center justify-between px-6 md:px-10 py-6 lg:px-0">
        {/* Logo */}
        <Link to="/" className="text-blue-600 font-extrabold text-xl font-jakarta">
          HandsOn.
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-10 font-franklin text-[16px] font-normal mx-auto">
          <li>
            <Link to="/login" className="text-gray-800 hover:text-blue-600 transition">
              Login  
            </Link>
          </li>
          <li>
            <Link to="/register" className="text-gray-800 hover:text-blue-600 transition">
              Register  
            </Link>
          </li>
        </ul>

        {/* Search and Icons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-gray-50 rounded-full px-4 py-2 w-[300px]">
            <input
              type="text"
              placeholder="Search for Events"
              className="bg-transparent outline-none w-full text-sm text-gray-600 placeholder-gray-400"
            />
            <Search className="text-blue-400 w-5 h-5" />
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </section>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col items-center bg-gradient-to-b from-blue-50 to-white shadow-lg p-6">
          <ul className="flex flex-col items-center gap-6 font-franklin text-[16px] text-gray-700">
            <li>
              <Link to="/login" className="hover:text-blue-600 transition-all duration-300 cursor-pointer">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-600 transition-all duration-300 cursor-pointer">
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
