import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { navItems } from "../constants";
import { Link, useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search term

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem("username"); // Clear localStorage
    navigate("/login"); // Redirect to login page
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
    // Add search logic here (e.g., navigate to search results page)
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              onClick={handleHome}
              className="h-10 w-10 mr-2 cursor-pointer"
              src={logo}
              alt="Logo"
            />
            <span className="text-xl text-red tracking-tight">Olx</span>

            {/* Search Field  */}
            <form onSubmit={handleSearch} className="ml-6">
              <input
                type="text"
                className="px-4 py-2 border rounded-md"
                placeholder="Search..."
                value={props && props.search}
                onChange={(e) =>
                  props.setSearchTerm && props.setSearchTerm(e.target.value)
                }
              />
              <button
                type="submit"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Search
              </button>
            </form>
          </div>

          {/* Desktop Menu */}
          <ul className="sm:hidden lg:flex ml-10 space-x-12">
            {" "}
            {/* Add margin-left */}
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>

          {/* Desktop User Actions */}
          <div className="sm:hidden lg:flex justify-center space-x-12 items-center">
            {username ? (
              <>
                <span className="text-white">Hello, {username}</span>
                <Link
                  to="/sell"
                  className="bg-blue-500 py-2 px-3 rounded-md text-white"
                >
                  Sell
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 py-2 px-3 rounded-md text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>

            <div className="flex space-x-6">
              {username ? (
                <>
                  <span className="text-white">Hello, {username}</span>
                  <Link
                    to="/sell"
                    className="bg-blue-500 py-2 px-3 rounded-md text-white"
                  >
                    Sell
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 py-2 px-3 rounded-md text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
