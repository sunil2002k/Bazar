import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Productcat from "./Productcat";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import NotFound from "./Notfound";

function Home(props) {
  const [products, setProducts] = useState([]);
  const [Likedproducts, setLikedProducts] = useState([]);
  const [catproducts, setcatProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [issearch, setisSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = "http://localhost:8000/sell";
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch(() => alert("Server error occurred"));

    // Fetch liked products for the logged-in user
    const url2 = "http://localhost:8000/liked_product";
    const data = { userId: localStorage.getItem("userId") };
    axios
      .post(url2, data)
      .then((res) => {
        if (res.data.products) {
          setLikedProducts(res.data.products.map((product) => product._id));
        }
      })
      .catch(() => alert("Server error occurred"));
  }, []);

  const handleLike = async (productId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }
  
    // Determine if the product is already liked
    const isLiked = !Likedproducts.includes(productId); // true if we are liking, false if unliking
    const url = "http://localhost:8000/like_product";
    const data = { userId, productId };
  
    try {
      const response = await axios.post(url, data);
  
      // Handle response to toggle like/unlike
      if (response.data.isLiked !== undefined) {
        // Update the liked products state
        setLikedProducts((prevLiked) =>
          response.data.isLiked
            ? [...prevLiked, productId]  // Like the product
            : prevLiked.filter((id) => id !== productId)  // Unlike the product
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
    const url = `http://localhost:8000/search?search=${search}&loc=${localStorage.getItem("userloc")}`;
    await axios
      .get(url)
      .then((res) => {
        setcatProducts(res.data.products);
        setisSearch(true);
      })
      .catch(() => alert("Server error occurred"));
  };

  const handleCategory = (value) => {
    const filteredProducts = products.filter(
      (item) => item.category.toLowerCase() === value.toLowerCase()
    );
    setcatProducts(filteredProducts);
    setisSearch(true);
  };

  const resetSearch = () => {
    setSearch("");
    setisSearch(false);
  };

  return (
    <>
      <Navbar
        search={search}
        handleSearch={handleSearch}
        handleClick={handleClick}
        resetSearch={resetSearch}
      />
      <Productcat handleCategory={handleCategory} />
      {issearch && catproducts && catproducts.length === 0 && <NotFound />}

      <div className="homepage">
        {issearch && catproducts && catproducts.length > 0 ? (
          <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {catproducts.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                Likedproducts={Likedproducts}
                handleLike={handleLike}
                handleProduct={handleProduct}
              />
            ))}
          </div>
        ) : (
          <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {products.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
                Likedproducts={Likedproducts}
                handleLike={handleLike}
                handleProduct={handleProduct}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

function ProductCard({ item, Likedproducts, handleLike, handleProduct }) {
  return (
    <div
      className="product-item rounded-lg flex flex-col p-4 border shadow-md"
      onClick={() => handleProduct(item._id)}
    >
      {item.images && item.images.length > 0 ? (
        <div className="product-image relative aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
          <div
            className="absolute top-2 right-2 bg-gray-200 rounded-full cursor-pointer hover:text-red-800 transition-colors duration-200"
            style={{ padding:"0.27rem" }} 
            onClick={(e) => handleLike(item._id, e)}
          >
            {Likedproducts.includes(item._id) ? (
              <FaHeart style={{ fontSize: "1.3rem" }} className="text-red-600" />
            ) : (
              <FaHeart style={{ fontSize: "1.3rem" }} className="text-gray-400" />
            )}
          </div>
          <img
            src={`http://localhost:8000/${item.images[0]}`}
            alt="Product Image"
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : (
        <p>No images available</p>
      )}
      <div className="mt-4 flex flex-col items-start">
        <p className="text-lg font-semibold">{item.title}</p>
        <p className="text-sm pr-1">{item.category}</p>
        {/* <p className="mt-2 text-sm text-gray-700">{item.description}</p> */}
        <h3 className="mt-4 text-xl font-bold text-green-600">
          Rs. {item.price}
        </h3>
      </div>
    </div>
  );
}

export default Home;
