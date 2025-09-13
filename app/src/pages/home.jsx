import React, { useState } from "react";
import { Bell, Home, ScanLine, Map, Grid } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

const malls = [
  "Phoenix Citadel, Chennai",
  "Express Avenue, Chennai",
  "VR Mall, Chennai",
  "Lulu Mall, Kochi",
  "Orion Mall, Bangalore",
  "Select Citywalk, Delhi"
];

function ShoppingApp() {
  const [search, setSearch] = useState("");
  const [selectedMall, setSelectedMall] = useState(null);
  const filteredMalls = malls.filter(mall => mall.toLowerCase().includes(search.toLowerCase()));
  const navigate = useNavigate();
  const handleBellClick = () => navigate("/notifications");
  const handleSuggestionClick = (mall) => {
    setSearch(mall);
    setSelectedMall(mall);
  };
  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-screen shadow-lg rounded-2xl overflow-hidden">
      {/* Search Bar with Bell Icon */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search shopping malls..."
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-pink-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="relative ml-2" onClick={handleBellClick}>
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
          </button>
        </div>
        {search && (
          <div className="mt-2">
            {filteredMalls.length > 0 ? (
              <ul className="bg-gray-50 rounded shadow p-2">
                {filteredMalls.map(mall => (
                  <li
                    key={mall}
                    className="py-1 px-2 text-gray-700 hover:bg-pink-100 rounded cursor-pointer"
                    onClick={() => handleSuggestionClick(mall)}
                  >
                    {mall}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-400 text-sm">No result found</div>
            )}
          </div>
        )}
        {selectedMall && (
          <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded">
            <h4 className="font-semibold text-pink-600 mb-1">Mall Selected:</h4>
            <div className="text-gray-700">{selectedMall}</div>
            <div className="text-xs text-gray-400 mt-1">(You can add more info or actions here)</div>
          </div>
        )}
      </div>
  {/* Header removed as bell icon is now in the search bar */}

      {/* Featured Event */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Featured Events</h3>
        <div className="bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold">SUMMER FASHION FESTIVAL</h4>
            <button className="mt-2 bg-white text-pink-600 px-3 py-1 rounded-lg text-sm font-semibold">
              Learn More
            </button>
          </div>
          <img
            src="https://img.icons8.com/ios-filled/100/ffffff/shopping-bag.png"
            alt="event"
            className="w-20 h-20"
          />
        </div>
      </div>

      {/* Today's Top Offers */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">TODAY'S TOP OFFERS</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-100 p-3 rounded-xl text-center">
            <img
              src="https://img.icons8.com/color/96/nike.png"
              alt="nike"
              className="mx-auto w-12 h-12"
            />
            <p className="text-xs font-bold mt-1">25% OFF</p>
            <p className="text-sm text-gray-600">NIKE</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl text-center">
            <img
              src="https://img.icons8.com/color/96/starbucks.png"
              alt="starbucks"
              className="mx-auto w-12 h-12"
            />
            <p className="text-xs font-bold mt-1">BUY 1 GET 1</p>
            <p className="text-sm text-gray-600">STARBUCKS</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl text-center">
            <img
              src="https://img.icons8.com/color/96/samsung.png"
              alt="samsung"
              className="mx-auto w-12 h-12"
            />
            <p className="text-xs font-bold mt-1">10% OFF</p>
            <p className="text-sm text-gray-600">SAMSUNG</p>
          </div>
        </div>
      </div>

      {/* Explore Categories */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">EXPLORE CATEGORIES</h3>
        <div className="flex justify-between">
          {[
            { name: "Fashion", icon: "👗" },
            { name: "Electronics", icon: "💻" },
            { name: "Beauty", icon: "💄" },
            { name: "Food", icon: "🍔" },
            { name: "Sports", icon: "⚽" },
          ].map((cat) => (
            <div key={cat.name} className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 text-xl rounded-full">
                {cat.icon}
              </div>
              <p className="text-xs mt-1 text-gray-700">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
    </div>
  );
}

export default ShoppingApp;
