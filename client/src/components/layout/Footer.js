import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center overflow-hidden">
                <img src="/SecondServe.png" alt="Second Serve Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-xl font-bold">Second Serve</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your premier e-commerce platform connecting consumers with amazing products 
              from trusted shop owners. Discover, shop, and sell with confidence.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} />
                <span>support@secondserve.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} />
                <span>123 Commerce St, Business City, BC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Second Serve. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs flex items-center justify-center space-x-1">
              <span>Made with</span>
              <Heart size={12} className="text-red-500" />
              <span>for the e-commerce community</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 