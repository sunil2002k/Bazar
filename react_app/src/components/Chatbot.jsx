import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/chat";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    try {
      // Add user message
      setMessages(prev => [...prev, { role: "user", content: trimmedInput }]);
      setInput("");
      setIsLoading(true);

      // Get assistant response
      const response = await axios.post(API_URL, { message: trimmedInput });
      
      // Add assistant message
      setMessages(prev => [...prev, 
        { role: "assistant", content: response.data.message }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, 
        { role: "assistant", content: "Sorry, I'm having trouble responding. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button */}
      <button
        aria-label="Open chat"
        className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chat interface */}
      {isOpen && (
        <div className="animate-fade-up absolute bottom-full right-0 mb-2 w-80 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-3">
            <h2 className="font-semibold text-sm">Chat Assistant</h2>
            <button
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-200 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Messages container */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <span className="block text-xs font-medium text-gray-500 mb-1">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
                <div
                  className={`inline-block p-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800 text-sm">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;