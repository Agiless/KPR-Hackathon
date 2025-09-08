import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 Save new user to localStorage
    localStorage.setItem("user", JSON.stringify(formData));

    navigate("/home");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image3.jpeg')" }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          />
          <button
            type="submit"
            className="w-full bg-white/40 text-black py-3 rounded-lg font-semibold hover:bg-white/60 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-black mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;