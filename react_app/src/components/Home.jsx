import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Productcat from "./Productcat";
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
      <Productcat />
      <div className="homepage">
  {products && products.length > 0 ? (
    <div className="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {products.map((item, index) => {
        return (
          <div key={item._id || index} className="product-item  rounded-lg flex flex-col p-4">
            {item.images && item.images.length > 0 ? (
              item.images.map((image, idx) => (
                <div key={idx} className="product-image aspect-w-1 aspect-h-1 w-full h-48 overflow-hidden rounded-lg">
                  <img
                    src={`http://localhost:8000/${image}`}
                    alt="Product Image"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
            <div className="mt-4 flex flex-col items-start">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm pr-1">{item.category}</p>
              <p className="mt-2 text-sm text-gray-700">{item.description}</p>
              <h3 className="mt-4 text-xl font-bold text-green-600">Rs. {item.price}</h3>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p>No products available</p>
  )}
</div>

    </>
  );
}

export default Home;
