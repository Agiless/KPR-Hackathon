import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white z-20 shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold">Griffens</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-gray-400">Home</a>
          {/* <a href="#features" className="hover:text-gray-400">Features</a>
          <a href="#contact" className="hover:text-gray-400">Contact</a> */}
          <Link to="/chat" className="hover:text-gray-400">Chatbot</Link>
          <Link to="/map" className="hover:text-gray-400">3D Map</Link>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 right-0 w-48 bg-gray-800 rounded-xl shadow-xl p-4 space-y-4">
           <a href="/" className="block hover:text-gray-400">Home</a>
          {/*<a href="#features" className="block hover:text-gray-400">Features</a>
          <a href="#contact" className="block hover:text-gray-400">Contact</a> */}
          <Link to="/chat" className="block hover:text-gray-400">Chatbot</Link>
          <Link to="/map" className="hover:text-gray-400">3D Map</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
