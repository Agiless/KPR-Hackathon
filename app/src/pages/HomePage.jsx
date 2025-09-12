import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MallHighlights from "./MallHighlights";
import getCookie from "../../utils";

const mockFeatures = [
  { title: "3D Map", description: "Explore the mall in 3D with floor navigation", path: "/map" },
  { title: "Chatbot", description: "Get instant answers about stores & products", path: "/chat" },
  { title: "Product", description: "Browse and search products with ease", path: "/Product" },
  { title: "NAME", description: "Custom feature placeholder", path: "/name" },
];

function deleteCookie(name) {
  // Set the expiration date to a time in the past
  // The path=/ ensures it works across the whole site.
  // Change the path if the cookie was set with a specific path.
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

const mockContactInfo = [
  { label: "Email", value: "contact@example.com" },
  { label: "Phone", value: "+1 234 567 890" },
  { label: "Address", value: "123 Main St, Anytown, USA" },
];

const HomePage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState({ visible: false, message: "" });
  const [activeSection, setActiveSection] = useState("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
const [user, setUser] = useState(storedUser?.name || '');
//     // Get user from localStorage (optional)
// const storedUser = JSON.parse(localStorage.getItem("user"));
// const [user, setUser] = useState(storedUser || null);

const csrftoken = getCookie('csrftoken');


  // Redirect if no user found
  useEffect(() => {
    if (!storedUser) {
      navigate("/");
    }
  }, [storedUser, navigate]);

  // Scroll effect for navbar active link
  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        home: document.getElementById("home"),
        features: document.getElementById("features"),
        contact: document.getElementById("contact"),
      };
      for (const sectionId in sections) {
        if (sections[sectionId]) {
          const rect = sections[sectionId].getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Contact form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal({
      visible: true,
      message: "Thank you! Your message has been sent.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    deleteCookie('csrftoken');
    deleteCookie('sessionid');
    fetch("logout/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      credentials: "include",
    })
    setUser(null);
    navigate("/login"); // redirect back to login
  };

  const closeModal = () => setShowModal({ visible: false, message: "" });

  const bgImage = "mall1.png";

  const getNavLinkClasses = (sectionId) => {
    const baseClasses =
      "px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-800/50";
    const activeClasses = "bg-gray-800/70";
    return `${baseClasses} ${activeSection === sectionId ? activeClasses : ""}`;
  };

  return (
    <div
      className="w-full bg-cover bg-center relative font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gray-900/60"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-20 flex justify-between items-center px-8 py-4 bg-gray-900/60 backdrop-blur-md text-white">
        {/* Project Name */}
        <div className="text-2xl font-bold tracking-wide">Griffins</div>

        {/* Right Side */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 text-lg font-medium">
            <a href="#home" className={getNavLinkClasses("home")}>Home</a>
            <a href="#features" className={getNavLinkClasses("features")}>Features</a>
            <a href="#contact" className={getNavLinkClasses("contact")}>Contact</a>
            {/* <a href="/chat" className="px-3 py-1 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-800/50">Chat</a> */}
          </div>

          {/* User Dropdown */}
          
            {user ? (
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer hover:ring-2 hover:ring-white transition"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-4">
                    <div className="flex flex-col items-start gap-2">
                      <div className="text-sm text-gray-400">{user.name}</div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-center bg-red-600 px-4 py-2 mt-2 rounded-xl hover:bg-red-500 transition shadow-lg"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-500 transition shadow-lg"
              >
                Log-in
              </button>
            )}


          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {/* Hamburger Icon */}
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-16 right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl p-4 space-y-4">
                <a href="/" className="block text-white hover:text-gray-300">Home</a>
                <a href="#features" className="block text-white hover:text-gray-300">Features</a>
                <a href="#contact" className="block text-white hover:text-gray-300">Contact</a>
                
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Navbar separator */}
      <div className="fixed top-16 left-0 w-full z-10 border-b-2 border-blue-600"></div>

      {/* Main Content */}
      <main className="relative z-10 text-white">
        {/* Hero */}
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20"
        >
          {/* <h1 className="text-5xl sm:text-6xl font-bold mb-6 drop-shadow-xl">
              Welcome to 
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500">
                Griffin Mall
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6">
              Explore. Shop. Experience. Your one-stop destination for fashion, food, and fun.
            </p>

          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6">
            A modern platform that delivers the best experiences. Responsive, fast, and designed for the future.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl transition shadow-lg">
              Get Started
            </button>
            <button className="border border-gray-300 text-gray-200 hover:bg-gray-50 hover:text-gray-900 px-8 py-3 rounded-xl transition shadow-lg">
              Learn More
            </button>
          </div> */}
          {user ? (
    <MallHighlights />
  ) : (
    <div className="text-center">
      <h1 className="text-5xl sm:text-6xl font-bold mb-6 drop-shadow-xl">
        Welcome to 
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500">
          Griffin Mall
        </span>
      </h1>
      <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6">
        Explore. Shop. Experience. Your one-stop destination for fashion, food, and fun.
      </p>
      <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-6">
        A modern platform that delivers the best experiences. Responsive, fast, and designed for the future.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button 
          onClick={() => navigate("/login")}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl transition shadow-lg"
        >
          Get Started
        </button>

        <button className="border border-gray-300 text-gray-200 hover:bg-gray-50 hover:text-gray-900 px-8 py-3 rounded-xl transition shadow-lg">
          Learn More
        </button>
      </div>
    </div>
  )}
</section>

        {/* ✨ Separator */}
        <div className="relative w-full flex items-center justify-center py-8">
          <div className="w-3/4 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

        {/* Features */}
        <section id="features" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Features</h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {mockFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={()=> navigate(feature.path)}
                className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">Get in Touch</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Info */}
              <div>
                <p className="text-lg text-gray-200 mb-8">
                  We'd love to hear from you! Send us a message or find our contact information below.
                </p>
                <div className="space-y-6">
                  {mockContactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white/10 p-4 rounded-xl shadow-md"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 text-white font-semibold">
                        {item.label[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="text-gray-200">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4 text-gray-900">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition min-h-[100px]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Message</h3>
            <p className="text-gray-600 mb-6">{showModal.message}</p>
            <button
              onClick={closeModal}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
