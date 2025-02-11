import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import Navbar from "./Navbar";
import Productcat from "./Productcat";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import NotFound from "./Notfound";
import Chatbot from "./Chatbot";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

function Home() {
  const [products, setProducts] = useState([]);
  const [sellproducts, setSellproducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [catProducts, setCatProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16);
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = useCallback(() => {
    const url = "http://localhost:8000/sell";
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
          setSellproducts(res.data.products);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Calculate the current products to display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Pagination function to update current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle like/unlike functionality
  const handleLike = async (productId, e) => {
    e.stopPropagation();
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

  const handleProduct = (_id) => {
    navigate(`/product/${_id}`);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = async () => {
    const url = `http://localhost:8000/search?search=${search}&loc=${localStorage.getItem(
      "userloc"
    )}`;
    try {
      const res = await axios.get(url);
      setCatProducts(res.data.products);
      setIsSearch(true);
      window.scrollTo(0, 0);
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
      {/* Wrap the homepage content with a motion.div for animation */}
      <motion.div
        className="homepage"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
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
          <>
            <ProductList
              products={currentProducts}
              likedProducts={likedProducts}
              handleLike={handleLike}
              handleProduct={handleProduct}
            />
            <Pagination
              productsPerPage={productsPerPage}
              totalProducts={products.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        )}
      </motion.div>
      <Chatbot />
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
      className="product-item rounded-lg flex flex-col p-4 border shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
      onClick={() => handleProduct(item._id)}
    >
      {item.images && item.images.length > 0 ? (
        <div className="product-image relative aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
          <div
            className="absolute z-40 top-2 right-2 bg-gray-200 rounded-full cursor-pointer hover:text-red-800 transition-colors duration-200"
            style={{ padding: "0.27rem" }}
            onClick={(e) => handleLike(item._id, e)}
          >
            {likedProducts.includes(item._id) ? (
              <FaHeart style={{ fontSize: "1.3rem" }} className="text-red-600" />
            ) : (
              <FaHeart style={{ fontSize: "1.3rem" }} className="text-gray-400" />
            )}
          </div>
          <img
            src={`http://localhost:8000/${item.images[0]}`}
            alt="Product"
            className="h-full aspect-auto mix-blend-multiply w-full object-contain object-center"
          />
        </div>
      ) : (
        <p>No images available</p>
      )}
      <div className="mt-4 flex flex-col items-start">
        <div className="flex justify-between w-full">
          <p className="text-lg font-semibold">{item.title}</p>
          <p
            className={`text-sm ${
              item.prod_status === "New" ? "text-green-500" : "text-gray-500"
            }`}
          >
            {item.prod_status}
          </p>
        </div>
        <p className="text-sm pr-1">{item.category}</p>
        <h3 className="mt-4 text-xl font-bold text-green-600">
          रु. {Number(item.price).toLocaleString("en-IN")}
        </h3>
      </div>
    </div>
  );
}

// Extracted Pagination component
function Pagination({ productsPerPage, totalProducts, paginate, currentPage }) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  return (
    <nav className="flex justify-center items-center mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-blue-50 disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <ul className="flex items-center space-x-1 mx-3">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => {
                paginate(number);
              }}
              aria-current={currentPage === number ? "page" : undefined}
              className={`px-4 py-2 rounded-md border transition-transform duration-150 
                ${
                  currentPage === number
                    ? "bg-blue-600 text-white border-blue-600 font-bold transform scale-110"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-blue-50 disabled:opacity-50"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}

export default Home;
