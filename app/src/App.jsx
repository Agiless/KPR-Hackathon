import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import MallPathFinder from "./pages/MallPathFinder";
import ScanPage from "./pages/ScanPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/map" element={<MallPathFinder />} />
    </Routes>
  );
}

export default App;