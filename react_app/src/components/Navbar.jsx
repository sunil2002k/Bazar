import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Navbar = ({ search, handleSearch, handleClick, resetSearch }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem("username"); // Clear localStorage
    navigate("/login"); // Redirect to login page
  };
console.log(navigator.geolocation.getCurrentPosition)
  const handleHome = () => {
    navigate("/");
    resetSearch();
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
            <span className="text-xl text-red tracking-tight">Bazar</span>

            {/* Search Field  */}

            <div className="relative flex items-center max-w-sm w-full lg:mx-auto">
          <input
            type="text"
            className="w-full ml-10 py-2 px-4 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)
            }
          />
          <button
            type="submit"
            className="px-4 py-2 flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onClick={() => handleClick()}
          >
            <FaSearch className="h-5 w-5" />
          </button>
        </div>
        </div>

          

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
                <Link
                  to="/liked_products"
                  className="bg-blue-500 py-2 px-3 rounded-md text-white"
                >
                  Liked items
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
