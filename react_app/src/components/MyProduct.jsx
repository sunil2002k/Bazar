import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Productcat from "./Productcat";
import axios from "axios";
// import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer'
function Myproduct(props) {
  const [products, setProducts] = useState([]);
  const [catproducts, setcatProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setrefresh] = useState(false);
  const [issearch, setisSearch] = useState(false);
  useEffect(() => {
    const url = "http://localhost:8000/myproduct";
    let data = { userId: localStorage.getItem("userId") };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products); // Set all the products in the state
        }
      })
      .catch((err) => {
        alert("Server error occurred");
      });
  }, [refresh]);

  const handleSearch = (value) => {
    setSearch(value);
  };
  const resetSearch = () => {
    setSearch("");
    setisSearch(false);
  };
  const handleClick = () => {
    const filteredProducts = products.filter((item) => {
      return (
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    });
    setcatProducts(filteredProducts);
  };

  const handleCategory = (value) => {
    const filteredProducts = products.filter(
      (item) => item.category.toLowerCase() === value.toLowerCase()
    );
    setcatProducts(filteredProducts);
  };

  const handleDel = (pid) => {
    if (!localStorage.getItem("userId")) {
      alert("please login first");
      return;
    }
    const url = "http://localhost:8000/delete_product";
    const data = { userId: localStorage.getItem("userId"), pid };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert("Delete success");
          setrefresh(!refresh);
        }
      })
      .catch((err) => {
        alert("Server error occurred");
      });
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

      <div className="homepage animate-fade">
        {products && products.length > 0 ? (
          <div className="products-container  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {products.map((item, index) => (
            <div
              key={item._id || index}
              className="product-item rounded-lg shadow-md flex flex-col p-4 border"
            >
              {item.images && item.images.length > 0 ? (
                // Display only the first image
                <div className="product-image relative aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
                  {/* <FaHeart
                    className="absolute top-2 right-2 text-gray-400 text-xl cursor-pointer hover:text-red-500 transition-colors duration-200"
                    onClick={() => handleLike(item._id)}
                  /> */}
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
                {/* <p className="mt-2 text-sm text-gray-700">{item.description}</p> */}
                <h3 className="mt-4 text-xl font-bold text-green-600">
                  Rs. {Number(item.price).toLocaleString('en-IN')}
                </h3>
              </div>
              <Link
                to={`/editproduct/${item._id}`}
                className=" text-blue-700 mt-2 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 gap-3 "
              >
                <div >
                <FontAwesomeIcon icon={faEdit}  />

                &nbsp;  Edit product
                </div>
              </Link>
              <button
                onClick={() => handleDel(item._id)}
                className="text-red-700 mt-2 hover:text-white border border-red-700 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
              >
                <div>
                <FontAwesomeIcon icon={faTrash} className="" />
                &nbsp;    Delete
                </div>
              </button>
            </div>
          ))}
        </div>
        
        ) : (
          <p>No products available</p>
        )}
        <Footer/>
      </div>
      
    </>
  );
}

export default Myproduct;
