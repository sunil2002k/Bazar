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
import Myproduct from "./components/MyProduct";
import MyProfile from "./components/MyProfile";
import Notfound from "./components/Notfound";
import Editproduct from "./components/Editproduct";

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
    path: "/myprofile",
    element: <MyProfile />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/editproduct/:productId",
    element: <Editproduct />,
  },
  {
    path: "/myproduct",
    element: <Myproduct/>,
  },
  {
    path: "/notfound",
    element: <Notfound/>
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
