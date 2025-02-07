import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { FaHeart } from "react-icons/fa";
import Navbar from "./Navbar";
import Recommendations from "./Recommendations";
import Footer from "./Footer";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

let socket;

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [likedProducts, setLikedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { productId } = useParams();
  const [search, setSearch] = useState("");
  const [issearch, setisSearch] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const [lensStyle, setLensStyle] = useState({});
  // Create a ref for the messages container
  const messagesContainerRef = useRef(null);

  // Effect to scroll the container to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
      username: localStorage.getItem("username") || "Anonymous",
      text: newMessage,
      productId,
    };
    socket.emit("sendMsg", data);
    setNewMessage("");
  };
  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const lensX = e.clientX - rect.left; // Get the X position of the lens
    const lensY = e.clientY - rect.top;
    const correctedURL =
      `http://localhost:8000/${product.images[selectedImageIndex]}`.replace(
        /\\/g,
        "/"
      );

    setZoomStyle({
      backgroundImage: `url(${correctedURL})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "400%",
      backgroundRepeat: "no-repeat",
    });
    // Set lens position

    setLensStyle({
      left: `${lensX}px`,
      top: `${lensY}px`,
    });

    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div>
      <Navbar resetSearch={resetSearch} />
      <div className="container animate-fade mx-auto py-8 px-4">
        {product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="relative">
              <img
                src={`http://localhost:8000/${product.images[selectedImageIndex]}`}
                alt={product.title}
                className="rounded-sm mix-blend-multiply  w-full  object-contain "
                style={{ height: "28rem" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
              {/* Lens Effect */}
              {isZooming && (
                <div
                  className="absolute bg-gray-200 bg-opacity-50 border-2 border-indigo-500  pointer-events-none"
                  style={{
                    ...lensStyle,
                    width: "100px",
                    height: "100px",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
              )}
              {/* Zoomed Image */}
              {isZooming && (
                <div
                  className="absolute top-0 left-full z-30 cursor-zoom-in border rounded-lg shadow-lg bg-no-repeat bg-white"
                  style={{
                    ...zoomStyle,
                    width: "40rem",
                    height: "30rem",
                    marginLeft: "2rem",
                  }}
                ></div>
              )}

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
              {/* Product Details */}
              <div>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <p className="text-gray-600 text-lg">{product.category}</p>
                <p className="text-gray-600 text-lg">{product.prod_status}</p>
                <p className="text-green-600 text-2xl font-semibold">
                  रु. {Number(product.price).toLocaleString("en-IN")}
                </p>
                
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleContact(product.addedBy)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-lg shadow hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Contact Seller
                  </button>
                  <button
                    variant="outline"
                    className="flex hover:bg-slate-100 items-center gap-2 border-zinc-400 border-1 outline-none p-2 rounded-lg"
                    onClick={(e) => handleLike(product._id, e)}
                  >
                    <FaHeart
                      className={`text-2xl cursor-pointer ${
                        likedProducts.includes(product._id)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span>
                      {likedProducts.includes(product._id)
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </span>
                  </button>
                </div>

               
              </div>

              {/* Google Map */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Product Location</h2>
                <div className="relative w-full h-96 bg-gray-200 rounded-lg shadow-lg border border-gray-300">
                  <Map ploc={product.ploc} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}

        {/* Product Description */}
        {product && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg ">
            <h2 className="text-xl font-bold">Product Description</h2>
            <p className="mt-4 text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Chatbox */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg ">
          <h2 className="text-xl font-bold">Questions about this product</h2>
          <div ref={messagesContainerRef} className="overflow-y-auto h-40 border p-4 mt-4">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={idx} className="mb-2 animate-slideIn">
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
                if (e.key === "Enter" && newMessage.trim()) sendMessage();
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4">Contact Details</h2>
              {user ? (
                <div className="space-y-2">
                  <p>
                    <strong className="font-semibold">Username:</strong>{" "}
                    {user.username}
                  </p>
                  <p>
                    <strong className="font-semibold">Phone:</strong>{" "}
                    {user.mobile}
                  </p>
                  <p>
                    <strong className="font-semibold">Email:</strong>{" "}
                    {user.email}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No user details available.</p>
              )}
              <button
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {product && <Recommendations productId={product._id} />}

      <Footer />
    </div>
  );
};

export default ProductDetail;
