import React, { useEffect, useState } from "react";

export default function NotificationPage() {
  const [socket, setSocket] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/notifications/");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPopupMessage(data.message); // Show popup message
    };

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket disconnected!");

    return () => ws.close();
  }, []);

  const triggerPopup = () => {
    if (socket) {
      socket.send(JSON.stringify({ message: "User triggered popup!" }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={triggerPopup}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Trigger Popup
      </button>

      {popupMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg">
          {popupMessage}
        </div>
      )}
    </div>
  );
}
