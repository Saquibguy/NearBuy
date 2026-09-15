const express = require('express');
const ProductRequest = require('../models/ProductRequest');

const router = express.Router();

// Create Product Request
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      productName,
      category,
      description,
      budget,
      quantity,
      location,
      condition,
    } = req.body;

    // Check required fields
    if (
      !customerId ||
      !productName ||
      !category ||
      !description ||
      !budget ||
      !quantity ||
      !location
    ) {
      return res.status(400).json({
        message: 'All required fields are required',
      });
    }

    // Create request
    const request = await ProductRequest.create({
      customerId,
      productName,
      category,
      description,
      budget,
      quantity,
      location,
      condition: condition || 'New',
    });

    res.status(201).json({
      message: 'Product request created successfully',
      request,
    });
  } catch (error) {
    console.error(
      'Create request error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Get all active product requests
router.get('/', async (req, res) => {
  try {
    const requests =
      await ProductRequest.find({
        status: 'Active',
      }).sort({ createdAt: -1 });

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(
      'Get requests error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Get all product requests of a specific customer
router.get(
  '/customer/:customerId',
  async (req, res) => {
    try {
      const requests =
        await ProductRequest.find({
          customerId: req.params.customerId,
        }).sort({ createdAt: -1 });

      res.status(200).json({
        requests,
      });
    } catch (error) {
      console.error(
        'Get customer requests error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

// Get a single product request by ID
router.get('/:id', async (req, res) => {
  try {
    const request =
      await ProductRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        message: 'Request not found',
      });
    }

    res.status(200).json({
      request,
    });
  } catch (error) {
    console.error(
      'Get request details error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Cancel a product request
router.put(
  '/:id/cancel',
  async (req, res) => {
    try {
      const request =
        await ProductRequest.findByIdAndUpdate(
          req.params.id,
          {
            status: 'Cancelled',
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!request) {
        return res.status(404).json({
          message: 'Request not found',
        });
      }

      res.status(200).json({
        message:
          'Request cancelled successfully',
        request,
      });
    } catch (error) {
      console.error(
        'Cancel request error:',
        error.message
      );

      res.status(500).json({
        message: 'Server error',
      });
    }
  }
);

module.exports = router;