import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Productcat from "./Productcat";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const [products, setProducts] = useState([]);
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
      .catch((err) => {
        alert("Server error occurred");
      });
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = async () => {
    const url = "http://localhost:8000/search?search=" + search + '&loc=' + localStorage.getItem('userloc');
    await axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setcatProducts(res.data.products);
        setisSearch(true);
      })
      .catch((err) => {
        alert("Server error occurred");
      });
  };

  const handleCategory = (value) => {
    console.log(value);
    const filteredProducts = products.filter(
      (item) => item.category.toLowerCase() === value.toLowerCase()
    );
    setcatProducts(filteredProducts);
    setisSearch(true);
  };

  const handleLike = async (productId) => {
    let userId = localStorage.getItem("userId");
    const url = "http://localhost:8000/like_product";
    const data = { userId, productId };
    await axios
      .post(url, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        alert("Server error occurred");
      });
  };

  const handleProduct = (_id) => {
    navigate(`/product/${_id}`);
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
      {issearch && catproducts && <h5>Search items</h5>}
      {issearch && catproducts && catproducts.length === 0 && (
        <h5>No result found</h5>
      )}
      <div className="homepage">
        {issearch && catproducts && catproducts.length > 0 && (
          <div className="products-container  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {catproducts.map((item, index) => (
              <div
                key={item._id || index}
                className="product-item rounded-lg flex flex-col p-4"
                onClick={() => handleProduct(item._id)}
              >
                {item.images && item.images.length > 0 ? (
                
                  <div className="product-image relative aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
                    <FaHeart
                      className="absolute top-2  right-2 text-gray-400 text-xl cursor-pointer hover:text-red-500 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click from triggering `handleProduct`
                        handleLike(item._id);
                      }}
                    />
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
                  <p className="mt-2 text-sm text-gray-700">
                    {item.description}
                  </p>
                  <h3 className="mt-4 text-xl font-bold text-green-600">
                    Rs. {item.price}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!issearch && (
        <div className="homepage">
          {products && products.length > 0 ? (
            <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
              {products.map((item, index) => (
                <div
                  key={item._id || index}
                  className="product-item rounded-lg flex flex-col p-4"
                  onClick={() => handleProduct(item._id)}
                >
                  {item.images && item.images.length > 0 ? (
                    <div className="product-image relative aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
                      <FaHeart
                        className="absolute top-2 right-2 text-gray-400 text-xl cursor-pointer hover:text-red-500 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from triggering `handleProduct`
                          handleLike(item._id);
                        }}
                      />
                      <img
                        src={`http://localhost:8000/${item.images[0]}`} // Display only the first image
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
                    <p className="mt-2 text-sm text-gray-700">
                      {item.description}
                    </p>
                    <h3 className="mt-4 text-xl font-bold text-green-600">
                      Rs. {item.price}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products available</p>
          )}
        </div>
      )}
    </>
  );
}

export default Home;
