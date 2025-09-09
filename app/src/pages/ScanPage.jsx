
import React, { useRef, useState } from "react";

export default function ScanPage() {
  const videoRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");

  const openCamera = async () => {
    setError("");
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

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Scan a Product</h2>
      {!cameraOpen && (
        <button
          onClick={openCamera}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Open Camera
        </button>
      )}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {cameraOpen && (
        <div className="flex flex-col items-center gap-4 w-full">
          <video ref={videoRef} className="rounded-lg w-full max-h-80 bg-black" autoPlay playsInline />
          <button
            onClick={closeCamera}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Close Camera
          </button>
        </div>
      )}
      {/* You can add barcode/QR code scanning logic here */}
    </div>
  );
}
