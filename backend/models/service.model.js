const mongoose = require('mongoose');

const PricingTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const ServiceOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  }
});

const AddOnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  }
});

const ServiceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: String,
  fullDescription: String,
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'plumbing',
      'electrical',
      'cleaning',
      'beauty',
      'wellness',
      'home_maintenance',
      'appliance_repair',
      'pest_control',
      'painting',
      'carpentry',
      'landscaping',
      'other'
    ]
  },
  subCategory: String,
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  originalPrice: Number,
  pricingTiers: [PricingTierSchema],
  options: [ServiceOptionSchema],
  addOns: [AddOnSchema],
  duration: {
    type: String,
    required: [true, 'Please add a duration']
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  location: {
    type: String,
    enum: ['on-site', 'remote', 'both'],
    default: 'on-site'
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  icon: String,
  color: String,
  iconColor: String,
  includes: [String],
  requirements: [String],
  bookingNotice: String,
  cancellationPolicy: String,
  images: [String],
  availability: {
    monday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    },
    tuesday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    },
    wednesday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    },
    thursday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    },
    friday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    },
    saturday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    },
    sunday: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    }
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
ServiceSchema.index({ name: 'text', description: 'text', category: 'text', subCategory: 'text' });

module.exports = mongoose.model('Service', ServiceSchema);