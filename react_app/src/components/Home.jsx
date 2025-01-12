import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import Productcat from "./Productcat";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import NotFound from "./Notfound";
import Chatbot from "./Chatbot";

function Home() {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [catProducts, setCatProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = useCallback(() => {
    const url = "http://localhost:8000/sell";
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch(() => alert("Server error occurred while fetching products"));
  }, []);

  // Fetch liked products for the logged-in user
  const fetchLikedProducts = useCallback(() => {
    const url = "http://localhost:8000/liked_product";
    const data = { userId: localStorage.getItem("userId") };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.products) {
          setLikedProducts(res.data.products.map((product) => product._id));
        }
      })
      .catch(() =>
        alert("Server error occurred while fetching liked products")
      );
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchLikedProducts();
  }, [fetchProducts, fetchLikedProducts]);

  // Handle like/unlike functionality
  const handleLike = async (productId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    const url = "http://localhost:8000/like_product";
    const data = { userId, productId };

    try {
      const response = await axios.post(url, data);

      if (response.data.isLiked !== undefined) {
        setLikedProducts(
          (prevLiked) =>
            response.data.isLiked
              ? [...prevLiked, productId] // Add to liked
              : prevLiked.filter((id) => id !== productId) // Remove from liked
        );
      } else {
        alert("Failed to update like status");
      }
    } catch (error) {
      console.error("Error occurred during like/unlike:", error);
      alert("Server error occurred");
    }
  };

  const handleProduct = (_id) => {
    navigate(`/product/${_id}`);
  };

  const handleSearch = (value) => setSearch(value);

  const handleClick = async () => {
    const url = `http://localhost:8000/search?search=${search}&loc=${localStorage.getItem(
      "userloc"
    )}`;
    try {
      const res = await axios.get(url);
      setCatProducts(res.data.products);
      setIsSearch(true);
    } catch (error) {
      alert("Server error occurred while searching");
    }
  };

  const handleCategory = (value) => {
    const filteredProducts = products.filter(
      (item) => item.category.toLowerCase() === value.toLowerCase()
    );
    setCatProducts(filteredProducts);
    setIsSearch(true);
  };

  const resetSearch = () => {
    setSearch("");
    setIsSearch(false);
  };

  return (
    <>
      <Navbar
        search={search}
        handleSearch={handleSearch}
        handleClick={handleClick}
        resetSearch={resetSearch}
      />
      <div className="homepage animate-fade">
        <Productcat handleCategory={handleCategory} />
        {isSearch && catProducts && catProducts.length === 0 && (
          <NotFound className="h-screen flex items-center justify-center" />
        )}

        {isSearch && catProducts.length > 0 ? (
          <ProductList
            products={catProducts}
            likedProducts={likedProducts}
            handleLike={handleLike}
            handleProduct={handleProduct}
          />
        ) : (
          <ProductList
            products={products}
            likedProducts={likedProducts}
            handleLike={handleLike}
            handleProduct={handleProduct}
          />
        )}
      </div>
      <Chatbot/>
      <Footer />
    </>
  );
}

// Extracted ProductList component
function ProductList({ products, likedProducts, handleLike, handleProduct }) {
  return (
    <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {products.map((item) => (
        <ProductCard
          key={item._id}
          item={item}
          likedProducts={likedProducts}
          handleLike={handleLike}
          handleProduct={handleProduct}
        />
      ))}
    </div>
  );
}

// ProductCard component
function ProductCard({ item, likedProducts, handleLike, handleProduct }) {
  return (
    <div
      className="product-item rounded-lg flex flex-col p-4 border shadow-md hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      onClick={() => handleProduct(item._id)}
    >
      {item.images && item.images.length > 0 ? (
        <div className="product-image relative aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
          <div
            className="absolute top-2 right-2 bg-gray-200 rounded-full cursor-pointer hover:text-red-800 transition-colors duration-200"
            style={{ padding: "0.27rem" }}
            onClick={(e) => handleLike(item._id, e)}
          >
            {likedProducts.includes(item._id) ? (
              <FaHeart
                style={{ fontSize: "1.3rem" }}
                className="text-red-600"
              />
            ) : (
              <FaHeart
                style={{ fontSize: "1.3rem" }}
                className="text-gray-400"
              />
            )}
          </div>
          <img
            src={`http://localhost:8000/${item.images[0]}`}
            alt="Product"
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : (
        <p>No images available</p>
      )}
      <div className="mt-4 flex flex-col items-start">
        {/* Product Title and Product Status */}
        <div className="flex justify-between w-full">
          <p className="text-lg font-semibold">{item.title}</p>
          <p className={`text-sm ${item.prod_status === "New" ? "text-green-500" : "text-gray-500"}`}>
            {item.prod_status}
          </p>
        </div>

        {/* Product Category */}
        <p className="text-sm pr-1">{item.category}</p>

        {/* Product Price */}
        <h3 className="mt-4 text-xl font-bold text-green-600">
          ₹ {Number(item.price).toLocaleString("en-IN")}
        </h3>
      </div>
    </div>
  );
}


export default Home;
