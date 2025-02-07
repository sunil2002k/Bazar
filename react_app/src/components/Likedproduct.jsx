import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
// import Productcat from "./Productcat";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Likedproduct() {
  const [products, setProducts] = useState([]);
  const [Likedproducts, setLikedProducts] = useState([]);
  const [, setcatProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [, setisSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = "http://localhost:8000/liked_product";
    const data = { userId: localStorage.getItem("userId") };

    axios
      .post(url, data)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products); // Set products
          setLikedProducts(res.data.products.map((product) => product._id)); // Track liked products by ID
        }
      })
      .catch(() => alert("Server error occurred"));
  }, [Likedproducts]);

  const handleLike = async (productId) => {
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
    } catch {
      alert("Server error occurred");
    }
  
  };

  const handleSearch = (value) => setSearch(value);

  const resetSearch = () => {
    setSearch("");
    setisSearch(false);
  };
  const handleClick = () => {
    const filteredProducts = products.filter((item) =>
      [item.title, item.description, item.category].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    );
    setcatProducts(filteredProducts);
  };

  // const handleCategory = (value) => {
  //   const filteredProducts = products.filter(
  //     (item) => item.category.toLowerCase() === value.toLowerCase()
  //   );
  //   setcatProducts(filteredProducts);
  // };
  const handleProduct = (_id) => {
    navigate(`/product/${_id}`);
  };

  return (
    <>
      <Navbar search={search} handleSearch={handleSearch} handleClick={handleClick} resetSearch={resetSearch}/>
      {/* <Productcat handleCategory={handleCategory} /> */}

      <div className="homepage animate-fade">
        {products.length > 0 ? (
          <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {products.map((item) => (
              <div key={item._id} className="product-item rounded-lg flex flex-col p-4 shadow-md hover:shadow-lg cursor-pointer" onClick={() => handleProduct(item._id)}>
                {item.images && item.images.length > 0 ? (
                  <div className="product-image relative w-full h-48 overflow-hidden rounded-lg">
                    <FaHeart
                      className={`z-40 absolute top-2 right-2 text-xl cursor-pointer ${
                        Likedproducts.includes(item._id) ? "text-red-600" : "text-gray-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(item._id);
                      }}
                    />
                    <img
                      src={`http://localhost:8000/${item.images[0]}`}
                      alt="Product Image"
                      className="h-full aspect-auto mix-blend-multiply  w-full  object-contain  object-center"
                    />
                  </div>
                ) : (
                  <p>No images available</p>
                )}
                <div className="mt-4 flex flex-col items-start">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm">{item.category}</p>
                  <h3 className="mt-4 text-xl font-bold text-green-600">Rs. {item.price}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Likedproduct;
