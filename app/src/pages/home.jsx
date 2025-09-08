import React from "react";
import { Bell, Home, ScanLine, Map, Grid } from "lucide-react";
import { Link } from 'react-router-dom';
import { useEffect } from "react";

export default function ShoppingApp() {
  useEffect(() => {
    // Define an async function inside the effect
    fetch('http://127.0.0.1:8000/demo').then((resp)=> resp.json()).then((result)=>console.log(result)).catch((e)=>console.error(e))

  }, []);
  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-screen shadow-lg rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-gray-800">Phoenix Citadal, Chennai</h2>
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
      </div>

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
