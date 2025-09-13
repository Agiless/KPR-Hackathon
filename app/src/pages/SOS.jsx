import React, { useState, useCallback } from 'react';
import FloatingAlert from '../components/FloatingAlert';
// --- SVG Icon Components for clarity ---
const FileUploadIcon = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Loader = () => (
    <div className="loader border-8 border-gray-200 border-t-purple-600 rounded-full w-16 h-16 animate-spin mx-auto"></div>
);


export default function SOS() {
  const [parentName, setParentName] = useState("");
  const [childPhoto, setChildPhoto] = useState(null);
  const [fileName, setFileName] = useState("PNG, JPG, WEBP up to 10MB");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentState, setAgentState] = useState("idle");
  const [aiResponse, setAiResponse] = useState(null);

  // --- NEW state for floating alert ---
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChildPhoto(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!childPhoto) {
      alert("Please upload a photo.");
      return;
    }

    console.log("Agent Perceiving: Data collected.", { parentName, childPhoto });

    setAgentState("reasoning");
    setIsModalOpen(true);

    setTimeout(() => {
      const mockAiResponse = {
        description: {
          upper_wear: { type: "T-shirt", color: "Bright Red", pattern: "Spider-Man logo" },
          lower_wear: { type: "Shorts", color: "Blue" },
          footwear: { type: "Sneakers", color: "White" },
          accessories: "None",
        },
        estimated_age_group: "4-6 years old",
      };

      setAiResponse(mockAiResponse);

      // --- Trigger Floating Alert message ---
      const message = `🚨 Missing child alert! ${mockAiResponse.estimated_age_group}, last seen wearing ${mockAiResponse.description.upper_wear.color} ${mockAiResponse.description.upper_wear.type}. Stay alert in your area!`;
      setAlertMessage(message);
      setShowAlert(true);

      setAgentState("action");
    }, 2500);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setAgentState("idle");
      setAiResponse(null);
    }, 300);
  }, []);

    // --- RENDER ---
    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Aura Emergency SOS</h1>
                    <p className="text-gray-500 mt-2">Activate an AI-assisted alert to find a missing person.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input
                                type="text"
                                id="parentName"
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Priya Sharma"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Recent Photo of Child</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <FileUploadIcon />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} required />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{fileName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300">
                            Activate AI Alert
                        </button>
                    </div>
                </form>
            </div>
            
            {/* --- MODAL Component --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity">
                    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md mx-4 text-center">
                        {agentState === 'reasoning' && (
                            <div>
                                <Loader />
                                <h2 className="text-xl font-semibold mt-4 text-gray-700">AI Agent is Reasoning...</h2>
                                <p className="text-gray-500 mt-2">Analyzing image to generate a precise description.</p>
                            </div>
                        )}

                        {agentState === 'action' && aiResponse && (
                            <div>
                                <h2 className="text-2xl font-bold text-purple-700 mb-4">🚨 AI Alert Drafted 🚨</h2>
                                <div className="text-left bg-gray-50 p-4 rounded-lg border">
                                    <p><strong>Initiated By:</strong> {parentName}</p>
                                    <p><strong>Estimated Age:</strong> {aiResponse.estimated_age_group}</p>
                                    <hr className="my-3" />
                                    <h4 className="font-semibold text-md mb-2">AI-Generated Description:</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        <li><strong>Top:</strong> {aiResponse.description.upper_wear.color} {aiResponse.description.upper_wear.type} with a {aiResponse.description.upper_wear.pattern}.</li>
                                        <li><strong>Bottom:</strong> {aiResponse.description.lower_wear.color} {aiResponse.description.lower_wear.type}.</li>
                                        <li><strong>Shoes:</strong> {aiResponse.description.footwear.color} {aiResponse.description.footwear.type}.</li>
                                        <li><strong>Accessories:</strong> {aiResponse.description.accessories}.</li>
                                    </ul>
                                    <hr className="my-3" />
                                    <p className="text-sm text-red-600 font-semibold">Alert will be sent to security and nearby users in a 200-meter radius.</p>
                                </div>
                                <button onClick={closeModal} className="mt-6 w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating emergency banner */}
      <FloatingAlert
        message={alertMessage}
        visible={showAlert}
        duration={10000}
        reappearDelay={20000} 
        onClose={() => setShowAlert(false)}
      />
        </div>
    );
}   