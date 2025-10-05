const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const ChefSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  profileImage: {
    type: String,
    default: 'default-chef.jpg'
  },
  kitchenName: {
    type: String,
    required: [true, 'Please add your kitchen name'],
    trim: true
  },
  kitchenPhotos: [String],
  specialties: [String],
  bio: {
    type: String,
    required: [true, 'Please add a short bio']
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  cuisineTypes: [String],
  certifications: [String],
  foodSafetyLicense: {
    licenseNumber: String,
    expiryDate: Date,
    verified: {
      type: Boolean,
      default: false
    }
  },
  availability: {
    monday: { isAvailable: Boolean, from: String, to: String },
    tuesday: { isAvailable: Boolean, from: String, to: String },
    wednesday: { isAvailable: Boolean, from: String, to: String },
    thursday: { isAvailable: Boolean, from: String, to: String },
    friday: { isAvailable: Boolean, from: String, to: String },
    saturday: { isAvailable: Boolean, from: String, to: String },
    sunday: { isAvailable: Boolean, from: String, to: String }
  },
  deliveryOptions: {
    selfPickup: {
      type: Boolean,
      default: true
    },
    delivery: {
      type: Boolean,
      default: false
    },
    deliveryRadius: {
      type: Number,
      default: 5 // in kilometers
    },
    deliveryFee: {
      type: Number,
      default: 0
    }
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stripeAccountId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
ChefSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
ChefSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: 'chef' },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expire
    }
  );
};

// Match user entered password to hashed password in database
ChefSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Chef', ChefSchema);