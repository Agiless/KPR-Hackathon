

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
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
      className="w-full min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative font-sans"
      style={{ backgroundImage: 'url(image6.jpeg)' }}
    >
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
  <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-center items-center px-2 sm:px-6 p-0 m-0">
        <Navbar/>
  <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl w-full h-full flex flex-col px-2 sm:px-8 py-8 mt-0 max-h-[95vh]">
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
          
        </div>
        <form onSubmit={handleSend} className="flex p-2 border-t border-gray-300 bg-white/60 rounded-b-2xl mt-2 sticky bottom-2 max-h-[100px]">
            <textarea
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
  );
}

export default ChatPage;

