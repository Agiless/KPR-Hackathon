import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/home" element={<Navigate to="/" />} /> 👈 Redirects /home to / */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;