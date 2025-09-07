import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ShoppingApp from './home';
import ScanPage from './pages/ScanPage';
import MapPage from './pages/MapPage';
import ServicesPage from './pages/ServicesPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './Navigation/BottomNav';

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <p className='mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-gray-400'>Hello</p>
//     </>
//   )
// }
export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<ShoppingApp />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/services" element={<ServicesPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
