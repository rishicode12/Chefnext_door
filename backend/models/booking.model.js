const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  bookingNumber: {
    type: String,
    unique: true
  },
  serviceDetails: {
    name: String,
    description: String,
    price: Number,
    duration: String,
    durationMinutes: Number
  },
  selectedOptions: [{
    name: String,
    price: Number
  }],
  selectedAddOns: [{
    name: String,
    price: Number
  }],
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  endTime: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  specialInstructions: String,
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'rescheduled',
      'no_show'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'rescheduled',
        'no_show'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  payment: {
    amount: {
      type: Number,
      required: true
    },
    breakdown: {
      basePrice: Number,
      optionsPrice: Number,
      addOnsPrice: Number,
      tax: Number,
      serviceFee: Number,
      discount: Number,
      total: {
        type: Number,
        required: true
      }
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'wallet', 'cash']
    },
    transactionId: String,
    stripePaymentIntentId: String,
    stripeClientSecret: String,
    refundAmount: Number,
    refundReason: String,
    refundDate: Date
  },
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: Date
  },
  providerNotes: String,
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'provider', 'admin']
    },
    cancellationFee: Number,
    cancellationDate: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate booking number before saving
BookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(10000 + Math.random() * 90000).toString();
    this.bookingNumber = `BK-${dateStr}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);