import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { FaHeart } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import Navbar from "./Navbar";
import Footer from "./Footer";

let socket;

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [user, setUser] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [Likedproducts, setLikedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { productId } = useParams();
  const [search, setSearch] = useState("");
  const [issearch, setisSearch] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    axios
      .get(`http://localhost:8000/sell/${productId}`)
      .then((res) => {
        setProduct(res.data.product);
        localStorage.setItem("productId", res.data.product._id);
      })
      .catch(() => alert("Server error occurred"));
  }, [productId]);

  useEffect(() => {
    socket = io("http://localhost:8000");
    socket.on("connect", () => console.log("Socket connected"));
    return () => socket.off();
  }, []);

  useEffect(() => {
    socket.on("getMsg", (data) => {
      const filteredMessages = Array.isArray(data)
        ? data.filter((msg) => msg.productId === productId)
        : [];
      setMessages(filteredMessages);
    });
  }, [productId]);

  const handleLike = async (productId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");

    const url = "http://localhost:8000/like_product";
    const data = { userId, productId };

    try {
      const response = await axios.post(url, data);
      setLikedProducts((prevLiked) =>
        response.data.isLiked
          ? [...prevLiked, productId]
          : prevLiked.filter((id) => id !== productId)
      );
    } catch {
      alert("Server error occurred");
    }
  };

  const handleContact = (addedBy) => {
    axios
      .get(`http://localhost:8000/get-user/${addedBy}`)
      .then((res) => {
        setUser(res.data.user);
        setShowModal(true);
      })
      .catch(() => alert("Server error occurred"));
  };
  const resetSearch = () => {
    setSearch("");
    setisSearch(false);
  };

  const sendMessage = () => {
    const data = {
      username: localStorage.getItem("username"),
      text: newMessage,
      productId,
    };
    socket.emit("sendMsg", data);
    setNewMessage("");
  };

  return (
    <div>
      <Navbar resetSearch={resetSearch} />
      <div className="container mx-auto py-8 px-4">
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <img
                src={`http://localhost:8000/${product.images[selectedImageIndex]}`}
                alt={product.title}
                className="rounded-lg shadow-lg w-full h-80 object-cover"
              />
              <div className="flex gap-2 mt-4">
                {product.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:8000/${image}`}
                    alt={`${product.title} thumbnail`}
                    className={`w-20 h-20 object-cover cursor-pointer rounded-md ${
                      selectedImageIndex === idx ? "ring-4 ring-indigo-500" : ""
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-gray-600 text-lg">{product.category}</p>
              <p className="text-green-600 text-2xl font-semibold">
                ₹ {Number(product.price).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => handleContact(product.addedBy)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-lg shadow hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Contact Seller
              </button>
              <div className="flex items-center gap-2">
                <FaHeart
                  className={`text-2xl cursor-pointer ${
                    Likedproducts.includes(product._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => handleLike(product._id, e)}
                />
                <span>
                  {Likedproducts.includes(product._id)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Product Description */}
        {product && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Product Description</h2>
            <p className="mt-4 text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Chatbox */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Questions about this product</h2>
          <div className="overflow-y-auto max-h-40 border p-4 mt-4">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-semibold">{msg.username}:</span>{" "}
                  {msg.text}
                </div>
              ))
            ) : (
              <p>No messages yet.</p>
            )}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMessage.trim()) {
                  sendMessage(); // Call the sendMessage function
                }
              }}
              placeholder="Type your message"
              className="flex-1 border rounded-l-lg p-2"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4">Contact Details</h2>
              {user && (
                <div>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.mobile}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              )}
              <button
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
