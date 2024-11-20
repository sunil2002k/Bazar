import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmail = () => {
    if (email) {
      console.log("Email submitted:", email); // Replace with API logic
      setEmail(''); // Clear input
    }
  };

  return (
    <footer className="text-gray-600 py-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {/* Logo and Description */}
        <div className="flex items-center gap-2 space-x-4">
          <img className="h-12 w-12" src={logo} alt="Logo" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-left">Bazar</h2>
            <p className="text-gray-400 text-sm text-left">
              Your trusted online marketplace for buying and selling items locally. Discover great deals or post your own ads with ease.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/sell" className="hover:text-gray-300 transition-colors">
                Sell
              </Link>
            </li>
            <li>
              <Link to="/liked_products" className="hover:text-gray-300 transition-colors">
                Liked Products
              </Link>
            </li>
            <li>
              <Link to="/myprofile" className="hover:text-gray-300 transition-colors">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex justify-center sm:justify-start space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-500 transition-colors"
            >
              <FaFacebook size={28} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-400 transition-colors"
            >
              <FaTwitter size={28} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram size={28} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-700 transition-colors"
            >
              <FaLinkedin size={28} />
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Stay Updated</h3>
          <p className="text-gray-400 text-sm">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-l-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Email Input"
            />
            <button
              onClick={handleEmail}
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
              aria-label="Subscribe Button"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bazar. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
  