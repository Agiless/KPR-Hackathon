

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [pendingImage, setPendingImage] = useState(null); // { src, file }
  const [pendingCaption, setPendingCaption] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPendingImage({ src: ev.target.result, file });
        setPendingCaption("");
      };
      reader.readAsDataURL(file);
    }
    setShowImageDropdown(false);
  };

  const handleCaptureImage = async () => {
    setShowImageDropdown(false);
    setCameraError("");
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Unable to access camera. Please allow camera permissions.");
      setShowCamera(false);
    }
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      setPendingImage({ src: imageDataUrl, file: null });
      setPendingCaption("");
      // Stop camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
      setShowCamera(false);
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: "bot", text: "Thank you for your message!" }]);
    }, 700);
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: 'url(image6.jpeg)' }}
    >
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col px-4 sm:px-8 p-0 mx-2 sm:mx-6">
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => navigate('/home')}
              className="bg-black text-white px-5 py-2 rounded-full shadow hover:bg-gray-800 transition font-semibold"
            >
              Home
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center mt-8 mb-4 text-gray-900">Chat Support</h2>
          <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 mt-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`px-4 py-2 rounded-xl max-w-xs shadow bg-white/80 m-1`}>
                  {msg.image ? (
                    <>
                      <img src={msg.image} alt="Captured" className="max-w-[180px] max-h-[180px] rounded-lg mb-1" />
                      {msg.text && <div className="text-gray-900 mt-1">{msg.text}</div>}
                    </>
                  ) : (
                    <span className={
                      msg.from === "user"
                        ? "text-gray-900 font-semibold"
                        : "text-gray-900"
                    }>
                      {msg.text}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Camera Modal */}
          {showCamera && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30 rounded-2xl">
              <div className="bg-white p-4 rounded-xl flex flex-col items-center gap-4 shadow-lg">
                <video ref={videoRef} className="rounded-lg w-64 h-48 bg-black" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" />
                {cameraError && <div className="text-red-600 text-sm mb-2">{cameraError}</div>}
                <div className="flex gap-4">
                  <button
                    onClick={handleTakePhoto}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                  >
                    Capture
                  </button>
                  <button
                    onClick={handleCloseCamera}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Pending Image Modal (for caption) */}
          {pendingImage && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-40 rounded-2xl">
              <div className="bg-white p-4 rounded-xl flex flex-col items-center gap-4 shadow-lg w-80">
                <img src={pendingImage.src} alt="Preview" className="max-w-full max-h-48 rounded-lg" />
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded mb-2"
                  placeholder="Add a caption..."
                  value={pendingCaption}
                  onChange={e => setPendingCaption(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-4 w-full">
                  <button
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                    onClick={() => {
                      setMessages(msgs => [
                        ...msgs,
                        { from: "user", text: pendingCaption, image: pendingImage.src }
                      ]);
                      setPendingImage(null);
                      setPendingCaption("");
                    }}
                  >
                    Send
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    onClick={() => {
                      setPendingImage(null);
                      setPendingCaption("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSend} className="flex w-full border-t border-gray-300 bg-white/30 backdrop-blur-md rounded-b-2xl">
            <input
              type="text"
              className="flex-1 border-none px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300 bg-white/80 text-gray-900 border rounded-l-2xl"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className="relative flex items-center ml-1">
              <button
                type="button"
                className="flex items-center bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded transition"
                onClick={() => setShowImageDropdown((prev) => !prev)}
                tabIndex={-1}
                aria-label="More options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                </svg>
              </button>
              {showImageDropdown && (
                <div className="absolute bottom-12 right-0 bg-white border rounded shadow-lg z-20 min-w-[140px]">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                    onClick={handleCaptureImage}
                  >
                    Capture Image
                  </button>
                  <label className="block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
            <button type="submit" className="bg-blue-900 text-white px-5 py-2 font-semibold hover:bg-blue-800 transition ml-1 flex items-center justify-center" aria-label="Send">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

