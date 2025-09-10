

import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getCookie from "../../utils";

function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const csrftoken = getCookie('csrftoken')
  const navigate = useNavigate();

  const handleSend = (e) => {
    e.preventDefault(); // This should be the first line

    // Check if the input is empty or only whitespace.
    // The 'input' state variable should be checked, not 'messages'.
    if (!input.trim()) {
      return; // Stop the function if the input is invalid.
    }

    // 1. Optimistically add the user's message to the state.
    // Use a functional update to ensure you're working with the latest state.
    setMessages(prevMessages => [...prevMessages, { from: "user", text: input }]);

    // Store the current input value before it gets cleared.
    const userMessage = input;

    // Clear the input field immediately.
    setInput("");
    console.log(csrftoken)
    // 2. Send the message to the API.
    fetch("api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      credentials: "include",
      body: JSON.stringify({
        message: userMessage
      }),

    })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      // 3. Add the bot's response to the state after the API call is successful.
      // Use a functional update to avoid stale state issues.
      console.log(csrftoken,data)
      setMessages(prevMessages => [...prevMessages, { from: "bot", text: data.response || "Response received." }]);
    })
    .catch((err) => {
      console.error("Error sending message:", err);
      // Optional: Add a message to the chat indicating an error.
      setMessages(prevMessages => [...prevMessages, { from: "bot", text: "Sorry, something went wrong." }]);
    });
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative font-sans"
      style={{ backgroundImage: 'url(image6.jpeg)' }}
    >
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
  <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-center items-center px-2 sm:px-6 p-0 m-0">
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => navigate('/home')}
            className="bg-black text-white px-5 py-2 rounded-full shadow hover:bg-gray-800 transition font-semibold"
          >
            Home
          </button>
        </div>
  <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl w-full h-full flex flex-col px-2 sm:px-8 py-8 mt-0">
          {/* Chat icon removed as requested */}
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Chat Support</h2>
          <div className="flex-1 overflow-y-auto px-1 pb-4 min-h-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`px-4 py-2 rounded-xl max-w-xs shadow bg-white/80 m-1`}>
                  <span className={
                    msg.from === "user"
                      ? "text-gray-900 font-semibold"
                      : "text-gray-900"
                  }>
                    {msg.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex p-2 border-t border-gray-300 bg-white/60 rounded-b-2xl mt-2">
            <input
              type="text"
              className="flex-1 border-none rounded-l-lg px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300 bg-white/80 text-gray-900"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-900 text-white px-5 py-2 rounded-r-lg font-semibold hover:bg-blue-800 transition">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

