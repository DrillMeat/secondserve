import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Store,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isShopOwner } = useAuth();
  const { getCartCount, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <img src="/YOO.png" alt="Second Serve Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-xl font-bold text-gray-900">Second Serve</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-gray-700 border border-gray-300 rounded-lg px-4 py-2 transition-colors duration-200 hover:text-white hover:bg-green-600 hover:border-green-600 ${isActive('/') ? 'bg-green-600 text-white border-green-600' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-gray-700 border border-gray-300 rounded-lg px-4 py-2 transition-colors duration-200 hover:text-white hover:bg-green-600 hover:border-green-600 ${isActive('/products') ? 'bg-green-600 text-white border-green-600' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/about-secondserve" 
              className={`text-gray-700 border border-gray-300 rounded-lg px-4 py-2 transition-colors duration-200 hover:text-white hover:bg-green-600 hover:border-green-600 ${isActive('/about-secondserve') ? 'bg-green-600 text-white border-green-600' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-gray-700 border border-gray-300 rounded-lg px-4 py-2 transition-colors duration-200 hover:text-white hover:bg-green-600 hover:border-green-600 ${isActive('/contact') ? 'bg-green-600 text-white border-green-600' : ''}`}
            >
              Contact Us
            </Link>
            {/* Support us link */}
            <Link 
              to="/support-us"
              className="text-green-700 hover:text-green-900 font-semibold mx-2"
            >
              Support us
            </Link>
            {isShopOwner && (
              <Link 
                to="/shop" 
                className={`text-gray-700 hover:text-green-600 transition-colors duration-200 flex items-center space-x-1 ${isActive('/shop') ? 'bg-green-600 text-white border-green-600' : ''}`}
              >
                <Store size={16} />
                <span>Shop Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>
                    {isShopOwner && (
                      <Link
                        to="/shop"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Store size={16} />
                        <span>Shop Dashboard</span>
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`border border-green-600 bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-green-700 hover:border-green-700`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`text-gray-700 hover:text-green-600 transition-colors duration-200 ${isActive('/') ? 'bg-green-600 text-white border-green-600' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-gray-700 hover:text-green-600 transition-colors duration-200 ${isActive('/products') ? 'bg-green-600 text-white border-green-600' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about-secondserve"
                className={`text-gray-700 hover:text-green-600 transition-colors duration-200 ${isActive('/about-secondserve') ? 'bg-green-600 text-white border-green-600' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`text-gray-700 hover:text-green-600 transition-colors duration-200 ${isActive('/contact') ? 'bg-green-600 text-white border-green-600' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              {/* Support us link */}
              <Link
                to="/support-us"
                className="text-green-700 hover:text-green-900 font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Support us
              </Link>
              {isShopOwner && (
                <Link
                  to="/shop"
                  className={`text-gray-700 hover:text-green-600 transition-colors duration-200 flex items-center space-x-2 ${isActive('/shop') ? 'bg-green-600 text-white border-green-600' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store size={16} />
                  <span>Shop Dashboard</span>
                </Link>
              )}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-green-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`border border-green-600 bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-green-700 hover:border-green-700`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 