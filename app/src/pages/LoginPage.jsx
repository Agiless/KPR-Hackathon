import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("customer"); // 'customer' or 'retailer'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("api/login/", {
        method: "POST",
        // Correct header syntax
        headers: {
            "Content-Type": "application/json",
        },
        // Correct body format: stringified JSON
        body: JSON.stringify({
            username: formData.name, 
            password: formData.password
        }),
    })
    .then((resp) => {
        // Check for non-2xx status codes (e.g., 400 Bad Request)
        if (!resp.ok) {
            return resp.json().then(errorData => {
                throw new Error(errorData.error || 'Login failed.');
            });
        }
        return resp.json();
    })
    .then((data) => {
        // Correct logic: The code now runs ONLY after a successful fetch response.
        console.log(data);
        localStorage.setItem("user", JSON.stringify({name:formData.name}));
        alert("Login successful!");
        navigate("/");
        
        // Optional: Save the user's token to localStorage for later API calls
        localStorage.setItem("authToken", data.token);

    })
    .catch((err) => {
        // Correct logic: The code runs ONLY if the fetch call or response processing fails.
        console.error(err);
        alert(err.message);
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image1.jpeg')" }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-center mb-4 gap-4">
          <button
            type="button"
            onClick={() => setLoginType('customer')}
            className={`px-4 py-2 rounded-full font-semibold transition border-2 ${loginType === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/40 text-black border-gray-400'}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setLoginType('retailer')}
            className={`px-4 py-2 rounded-full font-semibold transition border-2 ${loginType === 'retailer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/40 text-black border-gray-400'}`}
          >
            Retailer
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center text-black mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white/40 text-black py-3 rounded-lg font-semibold hover:bg-white/60 active:bg-gray-800 active:text-white transition"
          >
            Sign-in
          </button>
        </form>

        <p className="text-center text-sm text-black mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
