import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import io from "socket.io-client";
import { FaHeart } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import Footer from "./Footer";

let socket;

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [user, setUser] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [Likedproducts, setLikedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false); // New state for modal visibility
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
      const _data = Array.isArray(data)
        ? data.filter((item) => item.productId === p.productId)
        : [];
      setMessages(_data);
    });
  }, [p.productId]);

  useEffect(() => {
    const url = "http://localhost:8000/liked_product";
    const data = { userId: localStorage.getItem("userId") };

    axios
      .post(url, data)
      .then((res) => {
        if (res.data.products) {
          setLikedProducts(res.data.products.map((product) => product._id));
        }
      })
      .catch(() => alert("Server error occurred"));
  }, []);

  const sendMessage = () => {
    const data = {
      username: localStorage.getItem("username"),
      text: newMessage,
      productId: localStorage.getItem("productId"),
    };
    socket.emit("sendMsg", data);
    setNewMessage("");
  };
  const handleLike = async (productId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    const isLiked = !Likedproducts.includes(productId);
    const url = "http://localhost:8000/like_product";
    const data = { userId, productId };

    try {
      const response = await axios.post(url, data);

      if (response.data.isLiked !== undefined) {
        setLikedProducts((prevLiked) =>
          response.data.isLiked
            ? [...prevLiked, productId]
            : prevLiked.filter((id) => id !== productId)
        );
      } else {
        alert("Failed to update like status");
      }
    } catch (error) {
      console.error("Error occurred during like/unlike:", error);
      alert("Server error occurred");
    }
  };

  const handleContact = (addedBy) => {
    axios
      .get(`http://localhost:8000/get-user/${addedBy}`)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          setShowModal(true); // Show the modal after fetching user data
        }
      })
      .catch(() => alert("Server error occurred"));
  };

  return (
    <div>
      <Navbar search={search} resetSearch={resetSearch} />
      <div className="product-detail">
        {product && (
          <div className="mt-2 ml-10">
            <div>
              <div className="img&contact">
                {/* Product details */}
                <div className="images  ">
                  <div className="main-image  h-90  mb-4  object-cover">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={`http://localhost:8000/${product.images[selectedImageIndex]}`}
                        alt={`${product.title}`}
                        className="object-cover  w-70 h-80 shadow-lg "
                      />
                    )}
                  </div>
                  <div className="thumbnail-gallery flex gap-2 mb-4 text-center">
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
                </div>

                <div className="product-info mt-4">
                  <div className="flex gap-9">
                  <h2 className="text-2xl font-bold">{product.title}</h2>
                  <div className="liked flex gap-4 mt-1 ">
                    <p className="font-semibold"> Add to favourites</p>
                    <FaHeart
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      className={
                        Likedproducts.includes(product._id)
                          ? "text-red-600"
                          : "text-gray-400"
                      }
                      onClick={(e) => handleLike(product._id, e)} // Like/Unlike action
                      data-tooltip-id="like-tooltip" // Associate with Tooltip
                      data-tooltip-content={
                        Likedproducts.includes(product._id)
                          ? "Unlike this product"
                          : "Like this product"
                      } // Dynamic tooltip content
                    />
                    {/* Tooltip Component */}
                    <Tooltip id="like-tooltip" place="top" />
                  </div>
                  </div>
                  <p className="text-lg text-gray-700 mt-2">
                    {product.category}
                  </p>
                  <h3 className="text-xl font-semibold text-green-600 mt-4">
                    Rs. {product.price}
                  </h3>
                  {/* Like Icon */}

                  
                </div>

                <div className="contact ">
                  {product.addedBy && (
                    <button
                      className="bg-cyan-500 hover:bg-cyan-600 py-2 px-3 rounded-md text-white"
                      onClick={() => handleContact(product.addedBy)}
                    >
                      Contact details
                    </button>
                  )}
                </div>
              </div>

              {/* Modal for contact details */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl text-center font-bold mb-4">
                      Contact Details
                    </h2>
                    {user && (
                      <div>
                        <p>
                          <strong>Username:</strong> {user.username}
                        </p>
                        <p>
                          <strong>Phone number:</strong> {user.mobile}
                        </p>
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                      </div>
                    )}
                    <div className="text-center">
                      <button
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-center"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="description mt-6 p-4 border">
              <h3 className="text-lg font-semibold mb-2">
                Product description
              </h3>
              <p className="text-md mt-2">{product.description}</p>
            </div>
          </div>
        )}

        {/* Chatbox */}
        <div className="chatbox mt-6 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">
            Questions about this product
          </h3>
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
              placeholder="Ask"
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
      <Footer/>
    </div>
  );
};

export default ProductDetail;
