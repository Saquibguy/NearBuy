const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
  try {
    const {
      requestId,
      offerId,
      customerId,
      sellerId,
      productName,
      price,
      condition,
      shopAddress,
    } = req.body;

    if (
      !requestId ||
      !offerId ||
      !customerId ||
      !sellerId ||
      !productName ||
      !price ||
      !condition ||
      !shopAddress
    ) {
      return res.status(400).json({
        message:
          'All required fields are required',
      });
    }

    // Prevent duplicate order
    const existingOrder = await Order.findOne({
      requestId,
    });

    if (existingOrder) {
      return res.status(400).json({
        message:
          'An order already exists for this request',
      });
    }

    const order = await Order.create({
      requestId,
      offerId,
      customerId,
      sellerId,
      productName,
      price,
      condition,
      shopAddress,
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error(
      'Create order error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Get customer's orders
router.get(
  '/customer/:customerId',
  async (req, res) => {
    try {
      const orders = await Order.find({
        customerId: req.params.customerId,
      })
        .populate(
          'sellerId',
          'name shopName phone area city pincode address rating reviewCount'
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        orders,
      });
    } catch (error) {
      console.error(
        'Get customer orders error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// Get seller's orders
router.get(
  '/seller/:sellerId',
  async (req, res) => {
    try {
      const orders = await Order.find({
        sellerId: req.params.sellerId,
      })
        .populate(
          'customerId',
          'name phone email'
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        orders,
      });
    } catch (error) {
      console.error(
        'Get seller orders error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

module.exports = router;