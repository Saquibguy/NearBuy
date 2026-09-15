const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      shopName,
      category,
      area,
      city,
      pincode,
      address,
      openingHours,
    } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,

      shopName,
      category,
      area,
      city,
      pincode,
      address,
      openingHours,

      rating: 0,
      reviewCount: 0,
    });

    res.status(201).json({
      message: 'Registration successful',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,

        shopName: user.shopName,
        category: user.category,
        area: user.area,
        city: user.city,
        pincode: user.pincode,
        address: user.address,
        openingHours: user.openingHours,

        rating: user.rating,
        reviewCount: user.reviewCount,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Email, password and role are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      role,
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      message: 'Login successful',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,

        shopName: user.shopName,
        category: user.category,
        area: user.area,
        city: user.city,
        pincode: user.pincode,
        address: user.address,
        openingHours: user.openingHours,

        rating: user.rating || 0,
        reviewCount: user.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);

    res.status(500).json({
      message: 'Server error',
    });
  }
});

// Update Seller Details
router.put('/seller/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      shopName,
      category,
      phone,
      openingHours,
      area,
      city,
      pincode,
      address,
    } = req.body;

    if (
      !shopName ||
      !category ||
      !phone ||
      !openingHours ||
      !area ||
      !city ||
      !pincode ||
      !address
    ) {
      return res.status(400).json({
        message: 'All seller details are required',
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        role: 'seller',
      },
      {
        shopName: shopName.trim(),
        category: category.trim(),
        phone: phone.trim(),
        openingHours: openingHours.trim(),
        area: area.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        address: address.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: 'Seller not found',
      });
    }

    res.status(200).json({
      message: 'Seller details updated successfully',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,

        shopName: user.shopName,
        category: user.category,

        area: user.area,
        city: user.city,
        pincode: user.pincode,
        address: user.address,

        openingHours: user.openingHours,

        rating: user.rating || 0,
        reviewCount: user.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error(
      'Update seller error:',
      error.message
    );

    res.status(500).json({
      message: 'Server error',
    });
  }
});

router.put('/customer/:id', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message:
          'Name, email and phone are required.',
      });
    }

    const updatedUser =
      await User.findOneAndUpdate(
        {
          _id: req.params.id,
          role: 'customer',
        },
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'Customer not found.',
      });
    }

    res.json({
      message:
        'Customer profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      'Customer profile update error:',
      error
    );

    // Duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          'This email is already registered.',
      });
    }

    res.status(500).json({
      message:
        'Server error while updating profile.',
    });
  }
});

// Change Password
router.put('/change-password', async (req, res) => {
  try {
    const {
      userId,
      currentPassword,
      newPassword,
    } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          'User ID, current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          'New password must be at least 6 characters.',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    if (user.password !== currentPassword) {
      return res.status(401).json({
        message: 'Current password is incorrect.',
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message:
          'New password must be different from the current password.',
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error(
      'Change password error:',
      error.message
    );

    res.status(500).json({
      message:
        'Server error while changing password.',
    });
  }
});

module.exports = router;