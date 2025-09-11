// import React, { useState, useEffect, useRef } from "react";
// //import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";
// import getCookie from "../../utils";

// function ChatPage() {
//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Hi! How can I help you today?" }
//   ]);
//   const [input, setInput] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [showImageDropdown, setShowImageDropdown] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [cameraError, setCameraError] = useState("");
//   const [pendingImage, setPendingImage] = useState(null); // { src, file }
//   const [pendingCaption, setPendingCaption] = useState("");
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   useEffect(()=>{
    
//   },[])

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.onload = (ev) => {
        
//         setPendingImage({ src: ev.target.result, file });
//         setPendingCaption("");
//       };
//       reader.readAsDataURL(file);
//     }
//     setShowImageDropdown(false);
//   };

//   const handleCaptureImage = async () => {
//     setShowImageDropdown(false);
//     setCameraError("");
//     setShowCamera(true);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       }
//     } catch (err) {
//       setCameraError("Unable to access camera. Please allow camera permissions.");
//       setShowCamera(false);
//     }
//   };

//   const handleTakePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const imageDataUrl = canvas.toDataURL('image/png');
//       console.log(imageDataUrl)
//       setPendingImage({ src: imageDataUrl, file: null });
//       setPendingCaption("");
//       // Stop camera
//       if (video.srcObject) {
//         video.srcObject.getTracks().forEach(track => track.stop());
//         video.srcObject = null;
//       }
//       setShowCamera(false);
//     }
//   };

//   const handleCloseCamera = () => {
//     setShowCamera(false);
//     if (videoRef.current && videoRef.current.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };
//   //const navigate = useNavigate();

//   const messagesEndRef = useRef(null);

//   // 👇 Scroll to the bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
//   const csrftoken = getCookie('csrftoken')
//   const navigate = useNavigate();

//   const handleSend = (e) => {
//     e.preventDefault(); // This should be the first line

//     // Check if the input is empty or only whitespace.
//     // The 'input' state variable should be checked, not 'messages'.
//     if (!input.trim()) {
//       return; // Stop the function if the input is invalid.
//     }

//     // 1. Optimistically add the user's message to the state.
//     // Use a functional update to ensure you're working with the latest state.
//     setMessages(prevMessages => [...prevMessages, { from: "user", text: input }]);

//     // Store the current input value before it gets cleared.
//     const userMessage = input;

//     // Clear the input field immediately.
//     setInput("");
//     // setTimeout(() => {
//     //   setMessages((msgs) => [
//     //     ...msgs,
//     //     { from: "bot", text: "Thank you for your message!" }
//     //   ]);
//     // }, 700);
//     console.log(csrftoken)
//     // 2. Send the message to the API.
//     fetch("api/chat/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrftoken
//       },
//       credentials: "include",
//       body: JSON.stringify({
//         message: userMessage
//       }),

//     })
//     .then((resp) => {
//       return resp.json();
//     })
//     .then((data) => {
//       // 3. Add the bot's response to the state after the API call is successful.
//       // Use a functional update to avoid stale state issues.
//       console.log(csrftoken,data)
//       setMessages(prevMessages => [...prevMessages, { from: "bot", text: data.response || "Response received." }]);
//     })
//     .catch((err) => {
//       console.error("Error sending message:", err);
//       // Optional: Add a message to the chat indicating an error.
//       setMessages(prevMessages => [...prevMessages, { from: "bot", text: "Sorry, something went wrong." }]);
//     });
//   };

//   const handleKeyDown = (e) => {
//     // 👇 Allow Enter + Shift for new line, Enter alone sends
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend(e);
//     }
//   };

//   return (
//     <div
//       className="w-full min-h-screen flex items-center justify-center bg-cover bg-center relative"
//       style={{ backgroundImage: 'url(image6.jpeg)' }}
//     >
//       <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
//       <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-center items-center px-2 sm:px-6 p-0 m-0">
//         <Navbar />
//         <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl w-full h-full flex flex-col px-2 sm:px-8 py-8 mt-0 max-h-[95vh]">
//           <h2 className="text-3xl font-bold text-center mb-4 text-white mt-3">
//             Chat Support
//           </h2>
//           <div className="flex-1 overflow-y-auto px-1 pb-4 min-h-0">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`my-2 flex ${
//                   msg.from === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div className={`px-4 py-2 rounded-xl max-w-xs shadow bg-white/80 m-1`}>
//                   {msg.image ? (
//                     <>
//                       <img src={msg.image} alt="Captured" className="max-w-[180px] max-h-[180px] rounded-lg mb-1" />
//                       {msg.text && <div className="text-gray-900 mt-1">{msg.text}</div>}
//                     </>
//                   ) : (
//                     <span className={
//                       msg.from === "user"
//                         ? "text-gray-900 font-semibold"
//                         : "text-gray-900"
//                     }>
//                       {msg.text}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {/* 👇 Empty div to scroll into view */}
//             <div ref={messagesEndRef} />
//           </div>
//           {/* Camera Modal */}
//           {showCamera && (
//             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30 rounded-2xl">
//               <div className="bg-white p-4 rounded-xl flex flex-col items-center gap-4 shadow-lg">
//                 <video ref={videoRef} className="rounded-lg w-64 h-48 bg-black" autoPlay playsInline />
//                 <canvas ref={canvasRef} className="hidden" />
//                 {cameraError && <div className="text-red-600 text-sm mb-2">{cameraError}</div>}
//                 <div className="flex gap-4">
//                   <button
//                     onClick={handleTakePhoto}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
//                   >
//                     Capture
//                   </button>
//                   <button
//                     onClick={handleCloseCamera}
//                     className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {/* Pending Image Modal (for caption) */}
//           {pendingImage && (
//             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-40 rounded-2xl">
//               <div className="bg-white p-4 rounded-xl flex flex-col items-center gap-4 shadow-lg w-80">
//                 <img src={pendingImage.src} alt="Preview" className="max-w-full max-h-48 rounded-lg" />
//                 <input
//                   type="text"
//                   className="w-full border px-3 py-2 rounded mb-2"
//                   placeholder="Add a caption..."
//                   value={pendingCaption}
//                   onChange={e => setPendingCaption(e.target.value)}
//                   autoFocus
//                 />
//                 <div className="flex gap-4 w-full">
//                   <button
//                     className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
//                     onClick={() => {
//                       setMessages(msgs => [
//                         ...msgs,
//                         { from: "user", text: pendingCaption, image: pendingImage.src }
//                       ]);
//                       setPendingImage(null);
//                       setPendingCaption("");
//                     }}
//                   >
//                     Send
//                   </button>
//                   <button
//                     className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
//                     onClick={() => {
//                       setPendingImage(null);
//                       setPendingCaption("");
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           <form onSubmit={handleSend} className="flex w-full border-t border-gray-300 bg-white/30 backdrop-blur-md rounded-b-2xl">
//             <input
//               type="text"
//               className="flex-1 border-none px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300 bg-white/80 text-gray-900 border rounded-l-2xl"
//               placeholder="Type your message..."
//               value={input}
//               onChange={e => setInput(e.target.value)}
//             />
//             <div className="relative flex items-center ml-1">
//               <button
//                 type="button"
//                 className="flex items-center bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded transition"
//                 onClick={() => setShowImageDropdown((prev) => !prev)}
//                 tabIndex={-1}
//                 aria-label="More options"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <circle cx="5" cy="12" r="2" />
//                   <circle cx="12" cy="12" r="2" />
//                   <circle cx="19" cy="12" r="2" />
//                 </svg>
//               </button>
//               {showImageDropdown && (
//                 <div className="absolute bottom-12 right-0 bg-white border rounded shadow-lg z-20 min-w-[140px]">
//                   <button
//                     type="button"
//                     className="block w-full text-left px-4 py-2 hover:bg-blue-100"
//                     onClick={handleCaptureImage}
//                   >
//                     Capture Image
//                   </button>
//                   <label className="block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer">
//                     Upload Image
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />
//                   </label>
//                 </div>
//               )}
//             </div>
//             <button type="submit" className="bg-blue-900 text-white px-5 py-2 font-semibold hover:bg-blue-800 transition ml-1 flex items-center justify-center" aria-label="Send">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
//               </svg>
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;


import React, { useState, useEffect, useRef } from "react";
// The useNavigate import is kept as it's a built-in React Router hook.
import { useNavigate } from "react-router-dom";

// The Navbar component is now included directly in this file
const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 fixed top-0 left-0 z-20">
      <div className="flex items-center">
        <span className="text-white text-3xl font-bold">ChatApp</span>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        {/* Placeholder for future links */}
      </div>
      <div className="md:hidden">
        {/* Hamburger menu for mobile */}
        <button className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

// The getCookie utility function is now included directly in this file
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

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
  
  // This useEffect hook is now correctly configured to only scroll when the messages array changes.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      
      // Convert data URL to Blob to create a file object
      fetch(imageDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "capture.png", { type: "image/png" });
          setPendingImage({ src: imageDataUrl, file });
          setPendingCaption("");
        });
        
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

  const messagesEndRef = useRef(null);

  const csrftoken = getCookie('csrftoken')
  
  const handleSend = (e) => {
    e.preventDefault();

    // Determine the user's message and image (if any)
    const userMessage = input.trim();
    const isImageUpload = !!pendingImage;

    // Don't send if there's no message and no image
    if (!userMessage && !isImageUpload) {
      return;
    }

    // Optimistically add the user's message/image to the state
    const newMessage = { from: "user", text: userMessage, image: pendingImage?.src };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Clear the input and pending image/caption
    setInput("");
    setPendingImage(null);
    setPendingCaption("");

    // Send data to the appropriate API endpoint
    if (isImageUpload) {
      const payload = {
        message: userMessage,
        image: pendingImage.src // Send the data URL directly
      };
      
      fetch("api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type for JSON
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify(payload), // Send a JSON payload
      })
      .then((resp) => resp.json())
      .then((data) => {
        setMessages(prevMessages => [...prevMessages, { from: "bot", text: data.response || "Image received." }]);
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
        setMessages(prevMessages => [...prevMessages, { from: "bot", text: "Sorry, something went wrong with the image." }]);
      });
    } else {
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
      .then((resp) => resp.json())
      .then((data) => {
        setMessages(prevMessages => [...prevMessages, { from: "bot", text: data.response || "Response received." }]);
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setMessages(prevMessages => [...prevMessages, { from: "bot", text: "Sorry, something went wrong." }]);
      });
    }
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
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: 'url(image6.jpeg)' }}
    >
      <div className="absolute inset-0 bg-gray-900/60 z-0"></div>
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col justify-center items-center px-2 sm:px-6 p-0 m-0">
        <Navbar />
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl w-full h-full flex flex-col px-2 sm:px-8 py-8 mt-0 max-h-[95vh]">
          <h2 className="text-3xl font-bold text-center mb-4 text-white mt-3">
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
            {/* 👇 Empty div to scroll into view */}
            <div ref={messagesEndRef} />
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
                      // Call handleSend with a dummy event to trigger the logic
                      handleSend({ preventDefault: () => {} });
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