import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" text-white py-8 mt-10">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6">
        
        {/* Logo and Description */}
        <div className="space-y-4">
          <h2 className="text-gray-400 text-2xl font-bold">Bazar</h2>
          <p className="text-gray-400">
            Your trusted online marketplace for buying and selling items locally. Discover great deals or post your own ads with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className=" text-gray-400 space-y-2">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link to="/sell" className="hover:text-gray-300">Sell</Link>
            </li>
            <li>
              <Link to="/liked_products" className="hover:text-gray-300">Liked Products</Link>
            </li>
            <li>
              <Link to="/myprofile" className="hover:text-gray-300">Profile</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <h3 className="text-xl text-gray-400 font-semibold">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="hover:text-blue-500" size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-blue-400" size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-pink-500" size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-blue-700" size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bazar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
