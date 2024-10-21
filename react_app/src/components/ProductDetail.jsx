import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const ProductDetail = () => {

    const[product,setProduct] = useState()

    const p = useParams()
    console.log(p)
    useEffect(() => {
        const url = "http://localhost:8000/sell/"+ p.productId;
        axios
          .get(url)
          .then((res) => {
            console.log(res)
            if(res.data.product)
            {
                setProduct(res.data.product);
            }
          })
          .catch(() => {
            alert("Server error occurred");
          });
      }, []);
  return (

    <div>
        <Navbar/>
        ProductDetail
        {product &&  <div>
            <div>
                <img src={"http://localhost:8000/" 
                    + product.images
                } alt="" />
                {product.title}
            </div>
            <div>
                {product.category}
                {product.description}
                Rs. {product.price}

            </div>
        </div>

        
        }
    </div>
  )
}

export default ProductDetail;