const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a dish name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  image: {
    type: String,
    default: 'default-dish.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'dessert', 'beverage']
  },
  cuisineType: {
    type: String,
    required: [true, 'Please select a cuisine type']
  },
  dietaryInfo: {
    vegetarian: {
      type: Boolean,
      default: false
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    dairyFree: {
      type: Boolean,
      default: false
    },
    nutFree: {
      type: Boolean,
      default: false
    }
  },
  ingredients: [String],
  allergens: [String],
  preparationTime: {
    type: Number, // in minutes
    required: [true, 'Please add preparation time']
  },
  spicyLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
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
  }
});

const MenuSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a menu title'],
    trim: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: [true, 'Please specify the date for this menu'],
    default: Date.now
  },
  items: [MenuItemSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  orderCutoffTime: {
    type: String, // Format: "HH:MM"
    required: [true, 'Please specify order cutoff time']
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Please specify available quantity'],
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', MenuSchema);