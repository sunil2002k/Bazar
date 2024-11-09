
import "./index.css";
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
import MyProduct from './components/MyProduct';
import MyProfile from './components/MyProfile';


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
  {
    path: "/my-profile",
    element: (<MyProfile />),
  },
  {
    path: "/my-products",
    element: (<MyProduct />),
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);





