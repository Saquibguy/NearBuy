const express = require('express');
const Offer = require('../models/Offer');
const ProductRequest = require('../models/ProductRequest');
const Order = require('../models/Order');

const router = express.Router();

// Create Offer
router.post('/', async (req, res) => {
  try {
    const {
      requestId,
      sellerId,
      condition,
      price,
      availability,
      shopAddress,
      message,
    } = req.body;

    if (
      !requestId ||
      !sellerId ||
      !condition ||
      !price ||
      !availability ||
      !shopAddress
    ) {
      return res.status(400).json({
        message: 'All required fields are required',
      });
    }

    // Check whether request exists
    const request = await ProductRequest.findById(
      requestId
    );

    if (!request) {
      return res.status(404).json({
        message: 'Product request not found',
      });
    }

    // Check whether request is active
    if (request.status !== 'Active') {
      return res.status(400).json({
        message: 'This request is no longer active',
      });
    }

    // Prevent duplicate offer from same seller
    const existingOffer = await Offer.findOne({
      requestId,
      sellerId,
    });

    if (existingOffer) {
      return res.status(400).json({
        message:
          'You have already submitted an offer for this request',
      });
    }

    // Create offer
    const offer = await Offer.create({
      requestId,
      sellerId,
      condition,
      price,
      availability,
      shopAddress,
      message,
    });

    res.status(201).json({
      message: 'Offer submitted successfully',
      offer,
    });
  } catch (error) {
    console.error(
      'Create offer error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Get all offers for a request
router.get(
  '/request/:requestId',
  async (req, res) => {
    try {
      const offers = await Offer.find({
        requestId: req.params.requestId,
      })
        .populate(
          'sellerId',
          'name shopName category phone area city pincode address rating reviewCount'
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        offers,
      });
    } catch (error) {
      console.error(
        'Get offers error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// Get all offers made by a seller
router.get(
  '/seller/:sellerId',
  async (req, res) => {
    try {
      const offers = await Offer.find({
        sellerId: req.params.sellerId,
      })
        .populate(
          'requestId',
          'productName category description budget quantity location condition status'
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        offers,
      });
    } catch (error) {
      console.error(
        'Get seller offers error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// Select / Accept an offer
router.put(
  '/:offerId/accept',
  async (req, res) => {
    try {
      // Find selected offer
      const offer = await Offer.findById(
        req.params.offerId
      );

      if (!offer) {
        return res.status(404).json({
          message: 'Offer not found',
        });
      }

      // Find related request
      const request =
        await ProductRequest.findById(
          offer.requestId
        );

      if (!request) {
        return res.status(404).json({
          message: 'Product request not found',
        });
      }

      // Request must still be active
      if (request.status !== 'Active') {
        return res.status(400).json({
          message:
            'This request is no longer active',
        });
      }

      // Check if an order already exists
      const existingOrder =
        await Order.findOne({
          requestId: offer.requestId,
        });

      if (existingOrder) {
        return res.status(400).json({
          message:
            'An order already exists for this request',
        });
      }

      // Accept selected offer
      offer.status = 'Accepted';

      await offer.save();

      // Mark all other offers as Not Selected
      await Offer.updateMany(
        {
          requestId: offer.requestId,
          _id: {
            $ne: offer._id,
          },
        },
        {
          $set: {
            status: 'Not Selected',
          },
        }
      );

      // Mark request as completed
      request.status = 'Completed';

      await request.save();

      // Create order
      const order = await Order.create({
        requestId: offer.requestId,
        offerId: offer._id,
        customerId: request.customerId,
        sellerId: offer.sellerId,
        productName: request.productName,
        price: offer.price,
        condition: offer.condition,
        shopAddress: offer.shopAddress,
      });

      // Send response
      res.status(200).json({
        message:
          'Offer accepted and order created successfully',
        offer,
        request,
        order,
      });
    } catch (error) {
      console.error(
        'Accept offer error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

module.exports = router;