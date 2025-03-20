import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full py-16 bg-gradient-to-b from-white via-blue-100 to-white mt-auto flex flex-col">
      <div className="max-w-[1440px] mx-auto flex flex-col font-jakarta px-6 md:px-10 xl:px-0 mt-10">
        {/* Top Section */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center lg:text-left max-w-lg leading-tight text-gray-900">
            Stay connected with HandsOn.
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="w-full md:w-[360px] h-[50px] px-4 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full md:w-[140px] h-[50px] bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition shadow-md">
              Subscribe
            </button>
          </div>
        </div>

        {/* Middle Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Platform</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/events" className="hover:text-blue-500 transition">Volunteer Events</Link></li>
              <li><Link to="/requests" className="hover:text-blue-500 transition">Help Requests</Link></li>
              <li><Link to="/teams" className="hover:text-blue-500 transition">Volunteer Teams</Link></li>
              <li><Link to="/leaderboard" className="hover:text-blue-500 transition">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Resources</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/about" className="hover:text-blue-500 transition">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-blue-500 transition">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Account</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/login" className="hover:text-blue-500 transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-500 transition">Register</Link></li>
              <li><Link to="/profile" className="hover:text-blue-500 transition">Your Profile</Link></li>
            </ul>
          </div>
          
          {/* Branding */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-blue-500 mb-4">HandsOn.</h2>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
              Empowering communities through volunteer work. Join hands, make an impact.
            </p>
            {/* Social Media Icons */}
            <div className="flex justify-center lg:justify-start gap-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-500 transition text-xl"><FaFacebookF /></a>
              <a href="#" className="text-gray-500 hover:text-blue-500 transition text-xl"><FaTwitter /></a>
              <a href="#" className="text-gray-500 hover:text-blue-500 transition text-xl"><FaInstagram /></a>
              <a href="#" className="text-gray-500 hover:text-blue-500 transition text-xl"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full py-4 text-center text-gray-800 text-sm">
        <div className="max-w-[1440px] mx-auto">
          <p className="mb-2">
            <Link to="/privacy-policy" className="hover:text-blue-400  transition">Privacy Policy</Link> |
            <Link to="/terms" className="hover:text-blue-400 transition"> Terms & Conditions</Link>
          </p>
          <p>Copyright © 2025 || Jahidul Islam Shikdar || HandsOn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
