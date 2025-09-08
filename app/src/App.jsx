<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ShoppingApp from './pages/home';
import ScanPage from './pages/ScanPage';
import MapPage from './pages/MapPage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/loginpage';
import SignupPage from './pages/SignupPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NotificationPage from './pages/NotificationPage';
import BottomNav from './Navigation/BottomNav';
import { AuthProvider } from './context/AuthContext';

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <p className='mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-gray-400'>Hello</p>
//     </>
//   )
// }

function AppRoutesWithNav() {
  // Nav bar should be visible on all pages
  return (
    <div className="relative min-h-screen pb-16">
      <Routes>
        <Route path="/" element={<ShoppingApp />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
  <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutesWithNav />
      </BrowserRouter>
    </AuthProvider>
  );
}
=======
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
>>>>>>> 35b61a8437256cf4873a212aa767541dfae32feb
