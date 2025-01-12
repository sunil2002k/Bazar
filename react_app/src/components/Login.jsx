import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "./Home";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // Added remember me state
  });
  const [error, setError] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const onForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        formData
      );
      if (response.data.msg === "Login successful") {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.userId);

        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        navigate("/");
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  const onForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/forgetpassword",
        { email: forgotPasswordEmail }
      );
      if (response.data.msg === "Reset link sent successfully") {
        setError("Check your email for the reset link.");
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error(error);
      setError("Error sending reset link.");
    }
  };

  return (
    <div className="relative animate-fade min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Home />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-lg"></div>
      </div>

      <div className="absolute inset-0 bg-white opacity-40 backdrop-blur-lg z-0" />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {forgotPasswordMode ? "Reset Password" : "Login"}
        </h1>

        {/* Conditionally render forgot password form */}
        {forgotPasswordMode ? (
          <form onSubmit={onForgotPasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="forgotPasswordEmail"
                className="block text-sm font-medium text-gray-700">
                Enter Your Email
              </label>
              <input
                id="forgotPasswordEmail"
                type="email"
                name="email"
                value={forgotPasswordEmail}
                onChange={onForgotPasswordChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Your Email"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md">
              Send Reset Link
            </button>
            <p
              className="mt-4 text-center text-sm text-gray-600 cursor-pointer"
              onClick={() => setForgotPasswordMode(false)}>
              Go to Login ?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-800">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700">
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
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
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={onChange}
                  className="mr-2"
                />
                Remember Me
              </label>
              <p
                className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                onClick={() => setForgotPasswordMode(true)}>
                Forgot Password?
              </p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md">
              Login
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-indigo-600 hover:text-indigo-800">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
