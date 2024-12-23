import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "./Home"; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", formData);
      if (response.data.msg === "Login successful") {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.userId);
        navigate("/");
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center ">
      <div className="absolute inset-0 z-0">
        <Home />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-lg"></div>
      </div>
      
      <div className="absolute inset-0 bg-white opacity-40 backdrop-blur-lg z-0" />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="Email"
              type="text"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              placeholder="********"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-800">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
