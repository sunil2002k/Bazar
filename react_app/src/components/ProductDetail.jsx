import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import io from "socket.io-client";
let socket;
const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [user, setUser] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const p = useParams();
  const resetSearch = () => {
    setSearch("");
    setIsSearch(false);
  };

  useEffect(() => {
    const url = `http://localhost:8000/sell/${p.productId}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
          localStorage.setItem("productId", res.data.product._id);
        }
      })
      .catch(() => {
        alert("Server error occurred");
      });
  }, [p.productId]);

  useEffect(() => {
    socket = io("http://localhost:8000");
    socket.on("connect", () => {
      console.log("socket con");
    });
    return () => {
      socket.off();
    };
  }, []);
  useEffect(() => {
    socket.on("getMsg", (data) => {
      console.log(data, "data");
      const _data = Array.isArray(data)
        ? data.filter((item) => item.productId === p.productId)
        : [];
      setMessages(_data);
    });
  }, [p.productId]);

  const sendMessage = () => {
    const data = {
      username: localStorage.getItem("username"),
      text: newMessage,
      productId: localStorage.getItem("productId"),
    };
    socket.emit("sendMsg", data);
    setNewMessage("");
  };

  const handleContact = (addedBy) => {
    axios
      .get(`http://localhost:8000/get-user/${addedBy}`)
      .then((res) => {
        if (res.data.user) setUser(res.data.user);
      })
      .catch(() => alert("Server error occurred"));
  };

  return (
    <div>
      <Navbar search={search} resetSearch={resetSearch} />
      <div className="product-detail">
        {product && (
          <div className="mt-2 ml-10">
            {/* Product details */}
            <div className="main-image mb-4">
              {product.images && product.images.length > 0 && (
                <img
                  src={`http://localhost:8000/${product.images[selectedImageIndex]}`}
                  alt={`${product.title}`}
                  className="w-60 h-60 object-cover"
                />
              )}
            </div>
            <div className="thumbnail-gallery flex gap-2 mb-4">
              {product.images &&
                product.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:8000/${image}`}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className={`w-20 h-20 object-cover cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                  />
                ))}
            </div>

            <div className="product-info mt-4">
              <h2 className="text-2xl font-bold">{product.title}</h2>
              <p className="text-lg text-gray-700 mt-2">{product.category}</p>
              <p className="text-md mt-2">{product.description}</p>
              <h3 className="text-xl font-semibold text-green-600 mt-4">
                Rs. {product.price}
              </h3>
            </div>
            {product.addedBy && (
              <button
                className="bg-cyan-500 hover:bg-cyan-600 py-2 px-3 rounded-md text-white"
                onClick={() => handleContact(product.addedBy)}
              >
                Contact details
              </button>
            )}
            {user && user.username && <h4>Username : {user.username}</h4>}
            {user && user.mobile && <h4>Phone number : {user.mobile}</h4>}
            {user && user.email && <h4>Email : {user.email}</h4>}
          </div>
        )}

        {/* Chatbox */}
        <div className="chatbox mt-6 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Chat</h3>
          <div className="messages mb-4 h-40 overflow-y-auto border p-2">
            {Array.isArray(messages) ? (
              messages.map((msg, idx) => (
                <div key={idx} className="message mb-1">
                  <strong>{msg.username}:</strong> {msg.text}
                </div>
              ))
            ) : (
              <p>No messages available.</p>
            )}
          </div>

          <div className="input-area flex">
            <input
              type="text"
              className="flex-1 border rounded-l-lg p-2"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 rounded-r-lg"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
