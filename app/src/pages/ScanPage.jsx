import React, { useRef, useState } from "react";
import getCookie from "../../utils";

export default function ScanPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // NEW: State to display backend response
  const [recommendedImage, setRecommendedImage] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");

  const csrftoken = getCookie("csrftoken");

  // ---------- CAMERA HANDLING ----------
  const openCamera = async () => {
    setError("");
    setCapturedImage(null);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Unable to access camera. Please allow camera permissions.");
      setCameraOpen(false);
    }
  };

  const closeCamera = () => {
    setCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);

      // Close camera after capture
      setCameraOpen(false);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    }
  };

  // ---------- BASE64 -> FILE ----------
  const dataURLtoFile = (dataUrl, fileName) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

  // ---------- UPLOAD IMAGE TO BACKEND ----------
  const uploadImage = async () => {
    if (!capturedImage) {
      alert("Please capture an image first!");
      return;
    }

    setLoading(true);
    setRecommendedImage(null);
    setBackendMessage("");

    try {
      const file = dataURLtoFile(capturedImage, "captured.png");

      const formData = new FormData();
      formData.append("image", file); // must match Django serializer field

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]); // Debugging formData
      }

      const response = await fetch("/api/upload/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload Response:", data);

      if (response.ok) {
        // If backend sends recommended image
        if (data.recommended_image) {
          setRecommendedImage(data.recommended_image);
          setBackendMessage(data.text); // Clear any message
        }
        // If backend sends only a message
        else if (data.message) {
          setRecommendedImage(null);
          setBackendMessage(data.message);
        } else {
          setBackendMessage("No recommendation found.");
        }
      } else {
        setBackendMessage(data.error || "Unknown error occurred.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setBackendMessage("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url(image6.jpeg)" }}
    >
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center justify-center gap-6 p-6 mx-2 sm:mx-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Scan a Product</h2>

          {/* Open Camera Button */}
          {!cameraOpen && (
            <button
              onClick={openCamera}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              Open Camera
            </button>
          )}

          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

          {/* Camera View */}
          {cameraOpen && (
            <div className="flex flex-col items-center gap-4 w-full">
              <video
                ref={videoRef}
                className="rounded-lg w-full max-h-80 bg-black"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2">
                <button
                  onClick={handleCapture}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Capture Image
                </button>
                <button
                  onClick={closeCamera}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Close Camera
                </button>
              </div>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && (
            <div className="w-full flex flex-col items-center gap-2 mt-4">
              <label className="block text-gray-700 mb-1">Captured Image:</label>
              <img
                src={capturedImage}
                alt="Captured"
                className="rounded-lg w-full max-h-80 border mt-2"
              />
              <input
                type="text"
                className="w-full p-2 border rounded mt-2"
                placeholder="Enter text about the image..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button
                onClick={uploadImage}
                disabled={loading}
                className={`mt-3 px-6 py-2 rounded-lg text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } transition`}
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          )}

          {/* Backend Recommendation or Message */}
          {(recommendedImage || backendMessage) && (
            <div className="w-full flex flex-col items-center mt-6 p-4 bg-gray-100 rounded-lg shadow">
              {recommendedImage && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Recommended Product
                  </h3>
                  <img
                    src={recommendedImage}
                    alt="Recommendation"
                    className="rounded-lg border w-full max-h-80"
                  />
                </>
              )}

              {backendMessage && (
                <p className="text-gray-700 mt-2 text-center">{backendMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
