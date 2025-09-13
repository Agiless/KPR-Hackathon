
import React, { useRef, useState } from "react";
import getCookie from "../../utils";
import Navbar from "../components/Navbar";

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

  // Handle file upload (from device storage)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Utility: Convert base64 -> File
  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  // Upload handler (Cloudinary example, with optional backend call)
  const handleUpload = async () => {
    if (!capturedImage) return;

    try {
      const formData = new FormData();
      const file = dataURLtoFile(capturedImage, "scan.png");
      formData.append("file", file);
      formData.append("upload_preset", "your_unsigned_preset"); // Replace with Cloudinary preset

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Uploaded to Cloudinary:", data.secure_url);
      alert("Image uploaded successfully!");

      // --- Optional: send to your backend with caption ---
      // await fetch("http://localhost:5000/api/upload", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ imageUrl: data.secure_url, caption }),
      // });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image.");
    }
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

        <Navbar/>

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

          {/* Upload from storage */}
          <div className="flex flex-col items-center w-full">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition cursor-pointer mt-2"
            >
              Choose File
            </label>
          </div>

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
