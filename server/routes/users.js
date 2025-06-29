const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (admin only)
router.get('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.patch('/:id/role', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['consumer', 'shop_owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify shop owner (admin only)
router.patch('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'shop_owner') {
      return res.status(400).json({ message: 'Only shop owners can be verified' });
    }

    res.json({
      message: 'Shop owner verified successfully',
      user
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop owners (public)
router.get('/shop-owners', async (req, res) => {
  try {
    const { page = 1, limit = 12, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { 
      role: 'shop_owner',
      isVerified: true
    };

    if (search) {
      filter.$or = [
        { shopName: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const shopOwners = await User.find(filter)
      .select('name shopName shopDescription avatar')
      .sort({ shopName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      shopOwners,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalShops: total
      }
    });
  } catch (error) {
    console.error('Get shop owners error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop owner by ID (public)
router.get('/shop-owners/:id', async (req, res) => {
  try {
    const shopOwner = await User.findById(req.params.id)
      .select('name shopName shopDescription avatar');

    if (!shopOwner || shopOwner.role !== 'shop_owner') {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ shopOwner });
  } catch (error) {
    console.error('Get shop owner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 