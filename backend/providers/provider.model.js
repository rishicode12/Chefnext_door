const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const SpecialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  yearsExperience: Number
});

const BadgeSchema = new mongoose.Schema({
  icon: String,
  label: {
    type: String,
    required: true
  },
  description: String,
  isVerified: {
    type: Boolean,
    default: true
  }
});

const AvailabilitySchema = new mongoose.Schema({
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
});

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  profileImage: {
    type: String,
    default: 'default-provider.jpg'
  },
  serviceCategory: {
    type: String,
    required: true,
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
  subCategories: [String],
  experience: {
    type: Number,
    required: true,
  },
  description: String,
  specialties: [SpecialtySchema],
  badges: [BadgeSchema],
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
  serviceRadius: {
    type: Number,
    default: 10
  },
  availability: AvailabilitySchema,
  responseTime: String,
  completedJobs: {
    type: Number,
    default: 0
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
  identityDocuments: [{
    type: String
  }],
  qualificationDocuments: [{
    type: String
  }],
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  stripeAccountId: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
providerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// Match provider entered password to hashed password in database
providerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Provider", providerSchema);