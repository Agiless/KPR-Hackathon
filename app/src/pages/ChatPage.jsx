import React, { useState, useEffect, useRef } from "react";
//import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  //const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  // 👇 Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Thank you for your message!" }
      ]);
    }, 700);
  };

  const handleKeyDown = (e) => {
    // 👇 Allow Enter + Shift for new line, Enter alone sends
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative font-sans"
      style={{ backgroundImage: "url(image6.jpeg)" }}
    >
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-center items-center px-2 sm:px-6 p-0 m-0">
        <Navbar />
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl w-full h-full flex flex-col px-2 sm:px-8 py-8 mt-0 max-h-[95vh]">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Chat Support
          </h2>
          <div className="flex-1 overflow-y-auto px-1 pb-4 min-h-0">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl max-w-xs shadow bg-white/80 m-1`}
                >
                  <span
                    className={
                      msg.from === "user"
                        ? "text-gray-900 font-semibold"
                        : "text-gray-900"
                    }
                  >
                    {msg.text}
                  </span>
                </div>
              </div>
            ))}
            {/* 👇 Empty div to scroll into view */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form
  onSubmit={handleSend}
  className="flex items-center w-full p-2 bg-white/80 border-t border-gray-300 rounded-b-2xl sticky bottom-0"
>
  <textarea
    className="flex-1 min-h-[40px] max-h-[150px] px-4 py-2 rounded-l-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none overflow-y-auto rounded-xl  "
    placeholder="Type your message..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown} // Enter = send, Shift+Enter = newline
    rows={1}
  />
  <button
    type="submit"
    className="bg-blue-900 text-white px-6 py-2 ml-2 rounded-xl font-semibold hover:bg-blue-800 transition"
  >
    Send
  </button>
</form>

      </div>
    </div>
  );
}

export default ChatPage;
