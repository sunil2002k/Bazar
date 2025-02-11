import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Resetpassword from "./components/Resetpassword";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/sell",element: (
      <ProtectedRoute>
        <Sell />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product/:productId",
    element: <ProductDetail />,
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
    path: "/resetpassword/:id/:token",
    element: <Resetpassword />,
  },
  {
    path: "/myprofile",
    element: (
      <ProtectedRoute>
        <MyProfile />
      </ProtectedRoute>
    ),
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
    element: (
      <ProtectedRoute>
        <Myproduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notfound",
    element: <Notfound />,
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
