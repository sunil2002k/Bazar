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
import Product from "./components/Product";
import Sell from "./components/Sell";
import About from "./components/About";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/sell",
    element: <Sell />,
  },
  {
    path: "/about",
    element: <About/>,
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
    path: "/products",
    element: <Product />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
