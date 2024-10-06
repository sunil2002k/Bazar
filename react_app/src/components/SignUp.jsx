import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [signData, setSignData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const onChangeData = (e) => {
    const { name, value } = e.target;
    setSignData({
      ...signData,
      [name]: value,
    });
  };
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/signup", signData);

      console.log("Data posted successfully");
      alert("successfully submitted");

      setSignData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("error");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={signData.username}
              onChange={onChangeData}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Your username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="Email"
              name="email"
              type="text"
              value={signData.email}
              onChange={onChangeData}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={signData.password}
              onChange={onChangeData}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
