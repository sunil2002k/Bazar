import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = ({ search, handleSearch, handleClick, resetSearch }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loc, setLoc] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isProductDetailPage = location.pathname.startsWith("/product/");
  const isSellPage = location.pathname.startsWith("/sell");
  const username = localStorage.getItem("username");

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

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
      placeName: "Chhapiya, Rupandehi",
    },
    {
      latitude: 27.7103,
      longitude: 85.3222,
      placeName: "New Baneshwor, Kathmandu",
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
      <div className="container px-4 mx-auto relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              onClick={handleHome}
              className="h-10 w-11 mr-0 ml-1 cursor-pointer"
              src={logo}
              alt="Logo"
            />
            <span
              className="text-xl font-medium text-red cursor-pointer tracking-tight mr-3"
              onClick={handleHome}
            >
              Bazar
            </span>

            {/* Nearby Search */}
            {!isProductDetailPage && !isSellPage && (
              <select
                className="ml-4 sm:hidden md:block"
                value={loc}
                onChange={(e) => {
                  localStorage.setItem("userloc", e.target.value);
                  setLoc(e.target.value);
                }}
              >
                {locations.map((item, index) => (
                  <option
                    key={index}
                    value={`${item.latitude},${item.longitude}`}
                  >
                    {item.placeName}
                  </option>
                ))}
              </select>
            )}

            {/* Search Field */}
            {!isProductDetailPage && !isSellPage && (
              <div className="relative flex items-center max-w-sm w-full lg:mx-auto">
                <input
                  type="text"
                  className="w-full ml-2 md:ml-10 py-2 px-4 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) handleClick();
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 flex items-center justify-center text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onClick={handleClick}
                >
                  <FaSearch className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* User Actions for Large Screens */}
          <div className="md:hidden sm:hidden lg:flex justify-center space-x-12 items-center relative">
            {username ? (
              <>
                <button
                  onClick={toggleDropdown}
                  ref={dropdownRef}
                  className="text-white focus:outline-none"
                >
                  <FaUserCircle size={24} className="text-blue-700" />
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
                      className="w-full text-left px-4 py-2 text-red-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="bg-cyan-500 hover:bg-cyan-600 py-2 px-3 rounded-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button for Small Screens */}
          <div className="lg:hidden flex justify-end">
            <button onClick={toggleNavbar} className="text-white">
              {mobileDrawerOpen ? (
                <X size={24} className="text-red-500" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div
            className=" right-0  w-full p-12 flex flex-col justify-center items-center lg:hidden
          sticky top-0 z-50 py-3 backdrop-blur-lg  border-neutral-700/80"
          >
            <div className="flex flex-col space-y-4 items-center  ">
              {username ? (
                <ul className="relative mx-auto">
                  <li className="py-4">
                    <Link
                      to="/myprofile"
                      onClick={toggleNavbar}
                      className="text-lg"
                    >
                      Hello, {username}
                    </Link>
                    <Link
                      to="/liked_products"
                      onClick={toggleNavbar}
                      className="py-2 px-3 rounded-md text-lg"
                    >
                      Liked items
                    </Link>
                    <Link
                      to="/sell"
                      onClick={toggleNavbar}
                      className="py-2 px-3 text-lg"
                    >
                      Sell
                    </Link>
                    <Link
                      to="/myproduct"
                      onClick={toggleNavbar}
                      className="py-2 px-3 text-lg"
                    >
                      My Ads
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-800 mt-2 hover:text-white border border-red-700 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  px-5 py-2.5 text-center me-2 mb-2 "
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="sm:hidden">
                  <Link
                    to="/login"
                    onClick={toggleNavbar}
                    className=" hover:bg-cyan-600 py-2 px-3  rounded-md text-black text-lg"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
