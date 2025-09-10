// export default RegisterPage;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


function RegisterPage() {
  const [registerType, setRegisterType] = useState("customer"); // 'customer' or 'retailer'
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    category: "",
    description: "",
    tags: [], // array of tags
    tagInput: "", // for the input field
    floor: "",
    shopName: "",
  });
  // Handle tag input and add tag on space or comma or enter
  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ") || value.endsWith(",") || value.endsWith("#") || e.key === "Enter") {
      const tag = value.replace(/[# ,]/g, "").trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
      } else {
        setFormData((prev) => ({ ...prev, tagInput: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, tagInput: value }));
    }
  };

  // Remove tag
  const removeTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };
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
    fetch("api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.name,
        // Assuming your Django serializer also expects an 'email' field.
        // If not, you may need to collect email separately.
        email: formData.email,
        password: formData.password,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        // If the server returns an error (e.g., 400 Bad Request),
        // parse the error message and throw a new error.
        return response.json().then(errorData => {
            const errorMessage = Object.values(errorData).flat().join(' ');
            throw new Error(errorMessage || 'Registration failed.');
        });
      }
      // If successful, parse the JSON response.
      return response.json();
    })
    .then((data) => {
      // This block runs ONLY if the registration was successful.
      console.log("Registration successful:", data);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    })
    .catch((err) => {
      // This block runs if there's a network error or an API-level error.
      console.error("Registration error:", err);
      setShowConfirmPassword(err.message);
    });
    // localStorage.setItem("user", JSON.stringify(formData));
    // navigate("/home");
    localStorage.setItem("user", JSON.stringify(formData));
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image3.jpeg')" }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-center mb-4 gap-4">
          <button
            type="button"
            onClick={() => setRegisterType('customer')}
            className={`px-4 py-2 rounded-full font-semibold transition border-2 ${registerType === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/40 text-black border-gray-400'}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRegisterType('retailer')}
            className={`px-4 py-2 rounded-full font-semibold transition border-2 ${registerType === 'retailer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/40 text-black border-gray-400'}`}
          >
            Retailer
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Retailer-specific fields */}
          {registerType === 'retailer' && (
            <>
              {/* Shop Name */}
              <div>
                <label className="block text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white/60"
                  placeholder="Enter your shop name"
                  required
                />
              </div>
              {/* Floor */}
              <div>
                <label className="block text-gray-700 mb-1">Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white/60"
                  placeholder="e.g. Ground, 1st, 2nd, etc."
                  required
                />
              </div>
              {/* Category Dropdown */}
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white/60"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Food">Food</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home">Home</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white/60 min-h-[60px]"
                  placeholder="Describe your shop or offerings..."
                  required
                />
              </div>
              {/* Tags */}
              <div>
                <label className="block text-gray-700 mb-1">Product Tags</label>
                <input
                  type="text"
                  name="tagInput"
                  value={formData.tagInput}
                  onChange={handleTagInput}
                  onKeyDown={handleTagInput}
                  className="w-full p-3 rounded-lg bg-white/30 text-black focus:outline-none focus:ring-2 focus:ring-white/60"
                  placeholder="Type a tag and press space, comma, #, or Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      #{tag}
                      <button type="button" className="ml-2 text-blue-500 hover:text-red-500" onClick={() => removeTag(tag)}>&times;</button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
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
