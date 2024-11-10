import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [user, setuser] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [issearch, setisSearch] = useState(false);
  const p = useParams();

  const resetSearch = () => {
    setSearch("");
    setisSearch(false);
  };

  useEffect(() => {
    const url = `http://localhost:8000/sell/${p.productId}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
        }
      })
      .catch(() => {
        alert("Server error occurred");
      });
  }, [p.productId]);
  const handleContact = (addedBy) => {
    console.log("id", addedBy);
    const url = 'http://localhost:8000/get-user/'+ addedBy;
    axios
      .get(url)
      .then((res) => {
        if (res.data.user) {
          setuser(res.data.user);
        }
      })
      .catch(() => {
        alert("Server error occurred");
      });
  };

  return (
    <div>
      <Navbar search={search} resetSearch={resetSearch} />
      <div className="product-detail">
        {product && (
          <div className="mt-2 ml-10">
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
              <button className="bg-cyan-500 hover:bg-cyan-600 py-2 px-3 rounded-md text-white" onClick={() => handleContact(product.addedBy)}>
                Contact details
              </button>
            )}
            {user && user.username &&  (<h4>Username : {user.username}</h4>
          )}
          {user && user.mobile &&  (<h4>Phone number : {user.mobile}</h4>
          )}
          {user && user.email &&  (<h4>Email : {user.email}</h4>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
