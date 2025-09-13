import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import MallPathFinder from "./pages/MallPathFinder";
import ScanPage from "./pages/ScanPage";
import SOS from "./pages/SOS";
import Scan from "./pages/ScanPage"
import Popup from "./pages/ServicesPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/map" element={<MallPathFinder />} />
      <Route path="/sos" element={<SOS />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/popup" element={<Popup />} />
    </Routes>
  );
}

export default App;