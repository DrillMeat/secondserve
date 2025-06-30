import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  ShoppingBag, 
  Store, 
  Truck, 
  Shield, 
  Star,
  ArrowRight,
  Search,
  ShoppingCart
} from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const { data: featuredProducts } = useQuery(
    'featured-products',
    () => api.get('/products/featured').then(res => res.data.products),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: 'Wide Selection',
      description: 'Discover hundreds of products from verified sellers'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Freshness score with 99.99% accuracy',
      description: 'Our AI ensures you get the freshest food, always.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Shopping',
      description: 'Safe and protected transactions every time'
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: 'Trusted Sellers',
      description: 'Shop from verified and reliable store owners'
    }
  ];

  // Handler for basket click
  const handleCartClick = () => {
    window.location.href = '/products';
  };

  return (
    <div className="min-h-screen relative">
      {/* Cart Icon Top Right */}
      <button
        onClick={handleCartClick}
        className="absolute top-6 right-8 z-50 bg-white rounded-full shadow p-4 hover:bg-gray-100 transition"
        aria-label="Go to Products"
      >
        <ShoppingCart size={48} className="text-gray-700" />
      </button>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Save money! <br />Save Planet!
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Buy food with large discount before expiration. Prevent food wasting and save money! Shop with SecondServe
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-green-700 border border-gray-300 rounded-lg px-8 py-3 font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 hover:text-white hover:bg-green-600 hover:border-green-600"
                >
                  <Search size={20} />
                  <span>Browse Products</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-700 border border-gray-300 rounded-lg px-8 py-3 font-semibold transition-colors duration-200 inline-flex items-center space-x-2 hover:text-white hover:bg-green-600 hover:border-green-600"
                >
                  <Store size={20} />
                  <span>Become a Seller</span>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center ml-16"
            >
              <img 
                src="/YOO.png" 
                alt="Second Serve Logo" 
                className="w-[28rem] h-[28rem] object-contain rounded-2xl shadow-lg bg-white/20 p-4"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Second Serve?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best shopping experience with trusted sellers, fresh products and best AI feature
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 italic mb-6">
              Download our app to unlock all features.
            </h2>
          </motion.div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center items-center space-x-8 mt-2 mb-6">
                  <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="/balls.png" 
                      alt="Google Play" 
                      className="w-80 h-auto cursor-pointer"
                    />
                  </a>
                  <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="/App-Store-Logo-2020.png" 
                      alt="Download on App Store" 
                      className="w-96 h-auto cursor-pointer"
                    />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Join thousands of successful shop owners and start selling your products 
              to customers worldwide.
            </p>
            <Link
              to="/register"
              className="bg-white text-green-700 border border-gray-300 rounded-lg px-8 py-3 font-semibold transition-colors duration-200 inline-flex items-center space-x-2 hover:text-white hover:bg-green-600 hover:border-green-600"
            >
              <Store size={20} />
              <span>Become a Seller</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 