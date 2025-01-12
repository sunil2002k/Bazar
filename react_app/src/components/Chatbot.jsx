import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Ref for the chat messages container
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    // Add the user's message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        message: input,
      });

      // Update the messages with the assistant's reply
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response.data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Error processing request" },
      ]);
    }
  };

  return (
    <div>
      {/* Chat Icon */}
      <div
        className="fixed bottom-5 right-5 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        💬
      </div>

      {/* Chatbot Interface */}
      {isOpen && (
        <div className="fixed animate-fade bottom-20 right-5 w-80 bg-white shadow-lg rounded-lg overflow-hidden border">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-3">
            <span className="font-semibold">Chat Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white font-bold text-2xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Chat Messages Section */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.role === "user" ? "text-right" : "text-left text-blue-700"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
                <span className="inline-block animate-slideIn bg-gray-200 text-gray-700 px-3 py-2 rounded-lg">
                  {msg.content}
                </span>
              </div>
            ))}
            {/* This empty div acts as a reference to scroll into view */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Section */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center border-t border-gray-300 bg-gray-50 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="messages..."
              className="flex-1 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2"
            />

            <button
              onClick={handleSubmit}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
