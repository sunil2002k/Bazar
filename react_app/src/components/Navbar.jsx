import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = ({ search, handleSearch, handleClick, resetSearch }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loc, setLoc] = useState(null);
  const dropdownRef = useRef(null);
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleHome = () => {
    navigate("/");
    resetSearch();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let locations = [
    {
      latitude: 27.567694,
      longitude: 83.404143,
      placeName: "Siyari, Rupandehi",
    },
    {
      latitude: 22.783602,
      longitude: 75.657411,
      placeName: "Madhya Pradesh, India",
    },
    {
      latitude: 28.202949,
      longitude: 83.985629,
      placeName: "Phewa lake, Pokhara",
    },

    {
      latitude: 27.684324,
      longitude: 83.430913,
      placeName: "Butwal, Rupandehi",
    },
  ];

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

            {/* nearby search */}
            <select
              className="ml-4"
              value={loc}
              onChange={(e) => {
                localStorage.setItem("userloc", e.target.value);
                setLoc(e.target.value);
              }}
            >
              {locations.map((item, index) => {
                return (
                  <option value={`${item.latitude},${item.longitude}`}>
                    {item.placeName}
                  </option>
                );
              })}
            </select>

            {/* Search Field */}
            <div className="relative flex items-center max-w-sm w-full lg:mx-auto">
              <input
                type="text"
                className="w-full ml-10 py-2 px-4 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
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

          {/* User Actions */}
          <div className="sm:hidden lg:flex justify-center space-x-12 items-center relative">
            {username ? (
              <>
                <button
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                  className="text-white focus:outline-none"
                >
                  <FaUserCircle size={24} />
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-60 w-48 bg-white rounded-md shadow-lg py-2"
                  >
                    <Link
                      to="/myprofile"
                      className="block px-4 py-2 text-gray-700"
                    >
                      Hello, {username}
                    </Link>
                    <Link
                      to="/sell"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sell
                    </Link>
                    <Link
                      to="/liked_products"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Liked items
                    </Link>
                    <Link
                      to="/myproduct"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Ads
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
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
