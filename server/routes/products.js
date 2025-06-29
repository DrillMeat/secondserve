const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'rating']).withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .populate('shopOwner', 'name shopName')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('shopOwner', 'name shopName')
      .limit(8);

    res.json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shopOwner', 'name shopName shopDescription');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (shop owners only)
router.post('/', auth, authorize('shop_owner'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('category').isIn(['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Food', 'Other']).withMessage('Invalid category'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('brand').optional().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      ...req.body,
      shopOwner: req.user._id,
      shopName: req.user.shopName
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (shop owners only)
router.put('/:id', auth, authorize('shop_owner'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('images').optional().isArray({ min: 1 }).withMessage('At least one image is required'),
  body('category').optional().isIn(['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Food', 'Other']).withMessage('Invalid category'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (shop owners only)
router.delete('/:id', auth, authorize('shop_owner'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop owner's products
router.get('/shop/my-products', auth, authorize('shop_owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find({ shopOwner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({ shopOwner: req.user._id });

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle product active status
router.patch('/:id/toggle-status', auth, authorize('shop_owner'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.shopOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 