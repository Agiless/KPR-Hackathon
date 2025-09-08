import './App.css'
import ShoppingApp from './pages/home';
import ScanPage from './pages/ScanPage';
import MapPage from './pages/MapPage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './Navigation/BottomNav';

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
      </Routes>
  <BottomNav />
    </div>
  );
    <div className="relative min-h-screen pb-16">
      <Routes>
        <Route path="/" element={<ShoppingApp />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
  <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutesWithNav />
    </BrowserRouter>
  );
}