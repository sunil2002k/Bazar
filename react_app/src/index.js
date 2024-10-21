// import React from 'react';
// import ReactDOM from 'react-dom/client';
import "./index.css";
// import App from './App';
// import reportWebVitals from './reportWebVitals';

import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  // Link,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Sell from "./components/Sell";
import Productcat from "./components/Productcat";
import Likedproduct from "./components/Likedproduct";
import ProductDetail from "./components/ProductDetail";


const router = createBrowserRouter([
  
  {
    path: "/sell",
    element: <Sell />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetail/>,
  },
  {
    path: "/liked_products",
    element: <Likedproduct />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/categories",
    element: <Productcat />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
