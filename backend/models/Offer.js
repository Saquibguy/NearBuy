const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductRequest',
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    condition: {
      type: String,
      enum: ['New', 'Used'],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    availability: {
      type: String,
      required: true,
      trim: true,
    },

    shopAddress: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Not Selected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Offer', offerSchema);