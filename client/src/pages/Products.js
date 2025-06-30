import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample products for testing
  const sampleProducts = [
    {
      _id: '1',
      name: 'Fresh Strawberries',
      description: 'Juicy, sweet strawberries picked at peak ripeness.',
      price: 4.99,
      originalPrice: 7.68,
      images: ['/fresh.png'],
      categories: ['Food', 'Berries'],
      stock: 40,
      rating: { average: 4.8, count: 120 },
      shopName: 'BerryFarm',
      discountPercentage: 35
    },
    {
      _id: '2',
      name: 'Steak Meat',
      description: 'Premium quality steak meat, perfect for grilling.',
      price: 19.99,
      originalPrice: 39.98,
      images: ['/SteakMeat.png'],
      categories: ['Food', 'Meats'],
      stock: 20,
      rating: { average: 4.7, count: 85 },
      shopName: 'MeatHouse',
      discountPercentage: 50
    },
    {
      _id: '3',
      name: 'Tomatoes',
      description: 'Fresh, organic tomatoes full of flavor.',
      price: 2.99,
      originalPrice: 4.60,
      images: ['/tomatoes.png'],
      categories: ['Food', 'Vegetables', 'Groceries'],
      stock: 60,
      rating: { average: 4.6, count: 102 },
      shopName: 'VeggieMarket',
      discountPercentage: 35
    },
    {
      _id: '4',
      name: 'Raw Pork',
      description: 'Fresh raw pork, ideal for a variety of dishes.',
      price: 9.99,
      originalPrice: 15.37,
      images: ['/rawpork.png'],
      categories: ['Food', 'Meats'],
      stock: 30,
      rating: { average: 4.5, count: 77 },
      shopName: 'MeatHouse',
      discountPercentage: 35
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['Food', 'Groceries', 'Meats', 'Fruits', 'Vegetables', 'Bakery', 'Beverages', 'Snacks', 'Seafood', 'Berries'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || product.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Buy fresh food for low price</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  (selectedCategory === '' && category === 'All') || selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 