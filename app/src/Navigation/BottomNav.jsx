import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, Map, Grid, LogIn, UserPlus } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navs = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/scan", icon: ScanLine, label: "Scan" },
    { to: "/map", icon: Map, label: "Map" },
    { to: "/services", icon: Grid, label: "Services" },
    { to: "/login", icon: LogIn, label: "Login" },
    { to: "/signup", icon: UserPlus, label: "Sign Up" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md z-50">
      {navs.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center ${location.pathname === to ? 'text-pink-500' : 'text-gray-600'}`}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs">{label}</span>
        </Link>
      ))}
    </div>
  );
}
