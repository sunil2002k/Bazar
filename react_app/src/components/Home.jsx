import React, { useEffect, useState } from "react"
import Navbar from "./Navbar"
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import {useLocation, useNavigate} from 'react-router-dom';

function Home (props){
    const navigate = useNavigate()
   const [products, setProducts] = useState([]);
   
    // useEffect(()=>{
    //     if (!localStorage.getItem('token')){
    //         navigate('/login')
    //     }
    // },[])

    useEffect(() => {
        const url = 'http://localhost:8000/sell';
        axios.get(url)
          .then((res) => {
            console.log("Products from backend:", res.data.products); // This should log all the products from the backend
            if (res.data.products) {
              setProducts(res.data.products); // Set all the products in the state
            }
          })
          .catch((err) => {
            console.log(err);
            alert('Server error occurred');
          });
      }, []);
      
    const username = localStorage.getItem('username');
    return (
        <>
        <Navbar/>
        <div className="homepage">
            
            {/* <h1>Welcome to the home</h1> */}
            {products && products.length > 0 && products.map((item, index) => {
  console.log("Rendering product:", item); // This should print each product in the console
  
  return (
    <div key={item._id} className="card m-3">
      {item.images && item.images.length > 0 ? (
        item.images.map((image, idx) => (
          <img key={idx} src={`http://localhost:8000/${image}`} className="w-40 h-40" />
        ))
      ) : (
        <p>No images available</p>
      )}
      <p className="p-2 gap-7 ">{item.title }   | {item.category}</p>
      <p className="p-2">{item.description}</p>
      <h3 className="p-2">Rs. {item.price}</h3>
    </div>
  );
})}


        </div>
        </>
    )
}

export default Home