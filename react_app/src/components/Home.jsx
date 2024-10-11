import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
// import {useLocation, useNavigate} from 'react-router-dom';

function Home(props) {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = "http://localhost:8000/sell";
    axios
      .get(url)
      .then((res) => {
        console.log("Products from backend:", res.data.products); // This should log all the products from the backend
        if (res.data.products) {
          setProducts(res.data.products); // Set all the products in the state
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server error occurred");
      });
  }, []);
  const handleSearch = (value) => {
    console.log("Searching for:", value);
    setSearch(value);
  };
  const handleClick = () => {
    console.log("Products:", products);
    let fileredProducts = products.filter((item) => {
      if (
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      ) {
        return item;
      }
    });
    setProducts(fileredProducts);
  };
  return (
    <>
      <Navbar
        search={search}
        handleSearch={handleSearch}
        handleClick={handleClick}
      />
      <div className="homepage">
        {/* <h1>Welcome to the home</h1> */}
        {products && products.length > 0 ? (
          products.map((item, index) => {
            console.log("Rendering product:", item); // Debugging to ensure products are being rendered

            return (
              <div key={item._id || index} className="card m-3">
                {" "}
                {/* Use index as fallback key */}
                {item.images && item.images.length > 0 ? (
                  item.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:8000/${image}`}
                      alt="Product Image"
                      className="w-40 h-40"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
                <p className="p-2 gap-7 ">
                  {item.title} | {item.category}
                </p>
                <p className="p-2">{item.description}</p>
                <h3 className="p-2">Rs. {item.price}</h3>
              </div>
            );
          })
        ) : (
          <p>No products available</p>
        )}
      </div>
    </>
  );
}

export default Home;
