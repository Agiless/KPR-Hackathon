// src/components/FloatingAlert.jsx
import React, { useEffect, useState } from "react";

export default function FloatingAlert({
  message,
  visible,
  duration = 8000,
  reappearDelay = 30000, // 30s before reappearing
}) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    let timer;
    if (visible) {
      setShow(true);
      // Auto-hide after duration
      timer = setTimeout(() => setShow(false), duration);
    }
    return () => clearTimeout(timer);
  }, [visible, duration]);

  // Handle dismiss → reappear after delay
  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => setShow(true), reappearDelay);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm animate-bounce">
        <h3 className="font-bold text-lg">🚨 Emergency Alert</h3>
        <p className="mt-2 text-sm">{message}</p>
        <button
          onClick={handleDismiss}
          className="mt-3 text-xs bg-white text-red-600 font-bold px-3 py-1 rounded-lg hover:bg-gray-200 transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
