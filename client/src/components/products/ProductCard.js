import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="product-card bg-white rounded-lg shadow-soft overflow-hidden border border-gray-200"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discountPercentage}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Shop Name */}
          <p className="text-sm text-gray-500 mb-1">
            {product.shopName}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating.count > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex">
                {renderStars(product.rating.average)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCart(product._id)}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isInCart(product._id)
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ShoppingCart size={16} />
          <span>
            {product.stock === 0
              ? 'Out of Stock'
              : isInCart(product._id)
              ? 'In Cart'
              : 'Add to Cart'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 