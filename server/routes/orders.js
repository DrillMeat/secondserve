const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create order (consumers only)
router.post('/', auth, authorize('consumer'), [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Validate products and check stock
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (!product.isActive) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        shopOwner: product.shopOwner,
        shopName: product.shopName
      });

      subtotal += product.price * item.quantity;
    }

    // Calculate totals
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes,
      subtotal,
      tax,
      shipping,
      total
    });

    await order.save();

    // Update product stock
    await order.updateStock();

    res.status(201).json({
      message: 'Order created successfully',
      order: await order.populate('items.product', 'name images')
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer orders
router.get('/my-orders', auth, authorize('consumer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop owner orders
router.get('/shop/my-orders', auth, authorize('shop_owner'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { 'items.shopOwner': req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'name images price')
      .populate('items.shopOwner', 'name shopName');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const isShopOwner = order.items.some(item => 
      item.shopOwner._id.toString() === req.user._id.toString()
    );

    if (!isCustomer && !isShopOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (shop owners only)
router.patch('/:id/status', auth, authorize('shop_owner'), [
  body('status').isIn(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
  body('estimatedDelivery').optional().isISO8601().withMessage('Invalid date format'),
  body('cancellationReason').optional().isString().withMessage('Cancellation reason must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, trackingNumber, estimatedDelivery, cancellationReason } = req.body;

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if shop owner has items in this order
    const hasItems = order.items.some(item => 
      item.shopOwner.toString() === req.user._id.toString()
    );

    if (!hasItems) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update order status
    order.status = status;
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    
    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      order.cancelledBy = req.user._id;
      if (cancellationReason) order.cancellationReason = cancellationReason;
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order: await order.populate('customer', 'name email')
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order (customers only)
router.patch('/:id/cancel', auth, authorize('consumer'), [
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = req.user._id;
    if (reason) order.cancellationReason = reason;

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics (shop owners only)
router.get('/shop/statistics', auth, authorize('shop_owner'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalOrders,
      monthlyOrders,
      yearlyOrders,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
      yearlyRevenue
    ] = await Promise.all([
      Order.countDocuments({ 'items.shopOwner': req.user._id }),
      Order.countDocuments({ 
        'items.shopOwner': req.user._id,
        createdAt: { $gte: startOfMonth }
      }),
      Order.countDocuments({ 
        'items.shopOwner': req.user._id,
        createdAt: { $gte: startOfYear }
      }),
      Order.countDocuments({ 
        'items.shopOwner': req.user._id,
        status: { $in: ['pending', 'confirmed'] }
      }),
      Order.aggregate([
        { $match: { 'items.shopOwner': req.user._id, status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        { $match: { 'items.shopOwner': req.user._id } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
      ]),
      Order.aggregate([
        { $match: { 
          'items.shopOwner': req.user._id, 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth }
        }},
        { $unwind: '$items' },
        { $match: { 'items.shopOwner': req.user._id } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
      ]),
      Order.aggregate([
        { $match: { 
          'items.shopOwner': req.user._id, 
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfYear }
        }},
        { $unwind: '$items' },
        { $match: { 'items.shopOwner': req.user._id } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
      ])
    ]);

    res.json({
      statistics: {
        totalOrders,
        monthlyOrders,
        yearlyOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        yearlyRevenue: yearlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 