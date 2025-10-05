const { validationResult } = require('express-validator');
const Service = require('../models/service.model');
const Provider = require('../providers/provider.model');

// @desc    Get all services with filters
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      rating,
      location,
      availability,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter by location (if using GeoJSON)
    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: 50000 // 50km
        }
      };
    }

    // Filter by availability
    if (availability) {
      const [day, time] = availability.split(',');
      query[`availability.${day}.slots`] = {
        $elemMatch: {
          startTime: { $lte: time },
          endTime: { $gte: time }
        }
      };
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'popularity':
          sortOptions = { bookingCount: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const services = await Service.find(query)
      .populate('provider', 'name profilePicture rating')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalServices = await Service.countDocuments(query);

    res.json({
      success: true,
      count: services.length,
      totalPages: Math.ceil(totalServices / Number(limit)),
      currentPage: Number(page),
      services
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
exports.getServiceCategories = async (req, res) => {
  try {
    // Get all unique categories from services
    const categories = await Service.distinct('category');

    // Define category details
    const categoryDetails = {
      'Pizza': {
        icon: 'pizza-icon',
        description: 'Delicious pizzas with various toppings'
      },
      'Chinese': {
        icon: 'chinese-icon',
        description: 'Authentic Chinese cuisine'
      },
      'South Indian': {
        icon: 'south-indian-icon',
        description: 'Traditional South Indian dishes'
      },
      'Indian': {
        icon: 'indian-icon',
        description: 'Authentic Indian cuisine'
      },
      'Burgers': {
        icon: 'burger-icon',
        description: 'Juicy burgers and fries'
      },
      'Rolls': {
        icon: 'roll-icon',
        description: 'Fresh rolls and wraps'
      },
      'Dosa': {
        icon: 'dosa-icon',
        description: 'Crispy dosas with chutney'
      },
      'Cakes': {
        icon: 'cake-icon',
        description: 'Delicious cakes and pastries'
      },
      'Juices': {
        icon: 'juice-icon',
        description: 'Fresh juices and smoothies'
      }
    };

    // Map categories to their details
    const categoriesWithDetails = categories.map(category => ({
      name: category,
      icon: categoryDetails[category]?.icon || 'default-icon',
      description: categoryDetails[category]?.description || `${category} services`
    }));

    res.json({
      success: true,
      count: categoriesWithDetails.length,
      categories: categoriesWithDetails
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:serviceId
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId)
      .populate('provider', 'name profilePicture rating description specialties badges location contactInfo');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      success: true,
      service
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Provider only)
exports.createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      category,
      price,
      duration,
      options,
      addons,
      availability,
      location
    } = req.body;

    // Create new service
    const service = new Service({
      provider: req.provider.id,
      name,
      description,
      category,
      price,
      duration,
      options: options || [],
      addons: addons || [],
      availability: availability || {},
      location: location || req.provider.location
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:serviceId
// @access  Private (Provider only)
exports.updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      category,
      price,
      duration,
      options,
      addons,
      availability,
      location
    } = req.body;

    // Find service and check ownership
    let service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Update service fields
    const serviceFields = {};
    if (name) serviceFields.name = name;
    if (description) serviceFields.description = description;
    if (category) serviceFields.category = category;
    if (price) serviceFields.price = price;
    if (duration) serviceFields.duration = duration;
    if (options) serviceFields.options = options;
    if (addons) serviceFields.addons = addons;
    if (availability) serviceFields.availability = availability;
    if (location) serviceFields.location = location;

    // Update service
    service = await Service.findByIdAndUpdate(
      req.params.serviceId,
      { $set: serviceFields },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:serviceId
// @access  Private (Provider only)
exports.deleteService = async (req, res) => {
  try {
    // Find service and check ownership
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    // Delete service
    await service.remove();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search services
// @route   GET /api/services/search/:query
// @access  Public
exports.searchServices = async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Search using text index
    const services = await Service.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('provider', 'name profilePicture rating')
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalServices = await Service.countDocuments(
      { $text: { $search: searchQuery } }
    );

    res.json({
      success: true,
      count: services.length,
      totalPages: Math.ceil(totalServices / limit),
      currentPage: page,
      services
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get services by provider ID
// @route   GET /api/services/provider/:providerId
// @access  Public
exports.getServicesByProvider = async (req, res) => {
  try {
    const providerId = req.params.providerId;

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Get services by provider
    const services = await Service.find({ provider: providerId });

    res.json({
      success: true,
      count: services.length,
      provider: {
        id: provider._id,
        name: provider.name,
        profilePicture: provider.profilePicture,
        rating: provider.rating,
        description: provider.description,
        specialties: provider.specialties,
        badges: provider.badges
      },
      services
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
exports.getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get services by category
    const services = await Service.find({ category })
      .populate('provider', 'name profilePicture rating')
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalServices = await Service.countDocuments({ category });

    res.json({
      success: true,
      category,
      count: services.length,
      totalPages: Math.ceil(totalServices / limit),
      currentPage: page,
      services
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add option to service
// @route   POST /api/services/:serviceId/options
// @access  Private (Provider only)
exports.addServiceOption = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, price, description } = req.body;

    // Find service and check ownership
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Create new option
    const newOption = {
      name,
      price,
      description: description || ''
    };

    // Add option to service
    service.options.push(newOption);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Option added successfully',
      option: newOption
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove option from service
// @route   DELETE /api/services/:serviceId/options/:optionId
// @access  Private (Provider only)
exports.removeServiceOption = async (req, res) => {
  try {
    // Find service and check ownership
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Find option index
    const optionIndex = service.options.findIndex(
      option => option._id.toString() === req.params.optionId
    );

    if (optionIndex === -1) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Remove option
    service.options.splice(optionIndex, 1);
    await service.save();

    res.json({
      success: true,
      message: 'Option removed successfully'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service or option not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add addon to service
// @route   POST /api/services/:serviceId/addons
// @access  Private (Provider only)
exports.addServiceAddon = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, price, description } = req.body;

    // Find service and check ownership
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Create new addon
    const newAddon = {
      name,
      price,
      description
    };

    // Add addon to service
    service.addons.push(newAddon);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Addon added successfully',
      addon: newAddon
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove addon from service
// @route   DELETE /api/services/:serviceId/addons/:addonId
// @access  Private (Provider only)
exports.removeServiceAddon = async (req, res) => {
  try {
    // Find service and check ownership
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Find addon index
    const addonIndex = service.addons.findIndex(
      addon => addon._id.toString() === req.params.addonId
    );

    if (addonIndex === -1) {
      return res.status(404).json({ message: 'Addon not found' });
    }

    // Remove addon
    service.addons.splice(addonIndex, 1);
    await service.save();

    res.json({
      success: true,
      message: 'Addon removed successfully'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service or addon not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update service availability
// @route   PUT /api/services/:serviceId/availability
// @access  Private (Provider only)
exports.updateServiceAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!availability) {
      return res.status(400).json({ message: 'Availability data is required' });
    }

    // Find service and check ownership
    const service = await Service.findById(req.params.serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the provider owns this service
    if (service.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Update availability
    service.availability = availability;
    await service.save();

    res.json({
      success: true,
      message: 'Service availability updated successfully',
      availability: service.availability
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};