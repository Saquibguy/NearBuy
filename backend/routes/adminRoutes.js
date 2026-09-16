const express = require('express');

const User = require('../models/User');
const ProductRequest = require('../models/ProductRequest');
const Order = require('../models/Order');

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Count customers
    const totalCustomers = await User.countDocuments({
      role: 'customer',
    });

    // Count sellers
    const totalSellers = await User.countDocuments({
      role: 'seller',
    });

    // Count product requests
    const totalRequests =
      await ProductRequest.countDocuments();

    // Count orders
    const totalOrders =
      await Order.countDocuments();

    // Recent requests
    const recentRequests =
      await ProductRequest.find()
        .populate(
          'customerId',
          'name email'
        )
        .sort({ createdAt: -1 })
        .limit(5);

    // Recent orders
    const recentOrders =
      await Order.find()
        .populate(
          'customerId',
          'name email'
        )
        .populate(
          'sellerId',
          'name shopName'
        )
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
      success: true,

      statistics: {
        totalCustomers,
        totalSellers,
        totalRequests,
        totalOrders,
      },

      recentRequests,

      recentOrders,
    });
  } catch (error) {
    console.error(
      'Admin dashboard error:',
      error.message
    );

    res.status(500).json({
      success: false,
      message: 'Unable to load admin dashboard.',
    });
  }
});

module.exports = router;