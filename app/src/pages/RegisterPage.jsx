// export default RegisterPage;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check if all password rules are satisfied
    if (
      !(
        passwordValidations.length &&
        passwordValidations.upper &&
        passwordValidations.lower &&
        passwordValidations.number &&
        passwordValidations.special
      )
    ) {
      alert("Password is not strong enough!");
      return;
    }

    // 👉 Save new user to localStorage
    localStorage.setItem("user", JSON.stringify(formData));
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image3.jpeg')" }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"  
            className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"   
            className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          />


          
          {/* Password Input with Floating Rules */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  autoComplete="new-password"
                  onChange={handleChange}
                  onFocus={() => setShowRules(true)}
                  onBlur={() => setShowRules(false)}                  
                  className="w-full p-3 rounded-lg right-5 bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

                {/* Floating Box */}
                {showRules && (
                  <div className="absolute top-full mt-2 Left-0 w-64 bg-white shadow-lg rounded-lg p-3 text-sm z-10">
                    <p className={passwordValidations.length ? "text-green-600" : "text-red-600"}>
                      ✓ At least 8 characters
                    </p>
                    <p className={passwordValidations.upper ? "text-green-600" : "text-red-600"}>
                      ✓ At least one uppercase letter
                    </p>
                    <p className={passwordValidations.lower ? "text-green-600" : "text-red-600"}>
                      ✓ At least one lowercase letter
                    </p>
                    <p className={passwordValidations.number ? "text-green-600" : "text-red-600"}>
                      ✓ At least one number
                    </p>
                    <p className={passwordValidations.special ? "text-green-600" : "text-red-600"}>
                      ✓ At least one special character (!@#$%^&*)
                    </p>
                  </div>
                )}
              </div>


          {/* Confirm Password */}          
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}              
              className="w-full p-3 rounded-lg bg-white/30 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {formData.confirmPassword && (
              <p
                className={
                  formData.password === formData.confirmPassword
                    ? "text-green-600 text-sm mt-1"
                    : "text-red-600 text-sm mt-1"
                }
              >
                {formData.password === formData.confirmPassword
                  ? "✅ Passwords match"
                  : "❌ Passwords do not match"}
              </p>
            )}

          </div>


          <button
            type="submit"
            className="w-full bg-white/40 text-black py-3 rounded-lg font-semibold hover:bg-white/60 active:bg-gray-800 active:text-white transition"
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
