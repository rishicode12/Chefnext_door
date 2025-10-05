const Provider = require("./provider.model");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");
const { validationResult } = require('express-validator');
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// JWT Token Generator
const generateToken = (id) => {
  return jwt.sign({ id, role: 'provider' }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

// @desc    Register a provider
// @route   POST /api/providers/register
// @access  Public
exports.registerProvider = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      password, 
      serviceCategory, 
      experience, 
      location,
      description,
      specialties,
      serviceRadius
    } = req.body;

    // Check if provider already exists
    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: "Provider already exists with this email" });
    }

    // Create new provider
    const provider = new Provider({
      name,
      email,
      phone,
      password,
      serviceCategory,
      experience,
      description,
      location,
      serviceRadius
    });

    // Add specialties if provided
    if (specialties && specialties.length > 0) {
      provider.specialties = specialties;
    }

    await provider.save();

    // Generate JWT token
    const token = generateToken(provider._id);

    res.status(201).json({
      success: true,
      message: "Provider registered successfully",
      token,
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        serviceCategory: provider.serviceCategory,
        experience: provider.experience,
        location: provider.location,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update provider profile
// @route   PUT /api/providers/profile
// @access  Private (Provider only)
exports.updateProviderProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      description,
      specialties,
      location,
      serviceRadius,
      availability
    } = req.body;

    // Find provider
    const provider = await Provider.findById(req.provider.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    // Update fields
    if (name) provider.name = name;
    if (phone) provider.phone = phone;
    if (description) provider.description = description;
    if (specialties) provider.specialties = specialties;
    if (location) provider.location = location;
    if (serviceRadius) provider.serviceRadius = serviceRadius;
    if (availability) provider.availability = availability;

    await provider.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        serviceCategory: provider.serviceCategory,
        experience: provider.experience,
        description: provider.description,
        location: provider.location,
        serviceRadius: provider.serviceRadius
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get provider services
// @route   GET /api/providers/services
// @access  Private (Provider only)
exports.getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.provider.id });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get provider bookings
// @route   GET /api/providers/bookings
// @access  Private (Provider only)
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.provider.id })
      .populate('service', 'name category price duration')
      .populate('user', 'fullName email phone profilePicture')
      .sort({ 'scheduling.date': -1, 'scheduling.time': -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/providers/bookings/:bookingId/status
// @access  Private (Provider only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const bookingId = req.params.bookingId;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if provider is authorized
    if (booking.provider.toString() !== req.provider.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this booking" });
    }

    // Update status
    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: Date.now(),
      note: note || `Status updated to ${status}`
    });

    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: {
        id: booking._id,
        status: booking.status,
        statusHistory: booking.statusHistory
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get provider reviews
// @route   GET /api/providers/reviews
// @access  Private (Provider only)
exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.provider.id })
      .populate('user', 'fullName profilePicture')
      .populate('booking', 'service scheduling')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Respond to a review
// @route   POST /api/providers/reviews/:reviewId/respond
// @access  Private (Provider only)
exports.respondToReview = async (req, res) => {
  try {
    const { response } = req.body;
    const reviewId = req.params.reviewId;

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check if provider is authorized
    if (review.provider.toString() !== req.provider.id) {
      return res.status(403).json({ success: false, message: "Not authorized to respond to this review" });
    }

    // Add response
    review.providerResponse = {
      text: response,
      createdAt: Date.now()
    };

    await review.save();

    res.json({
      success: true,
      message: "Response added successfully",
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get provider dashboard stats
// @route   GET /api/providers/dashboard
// @access  Private (Provider only)
exports.getProviderDashboard = async (req, res) => {
  try {
    // Get provider
    const provider = await Provider.findById(req.provider.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    // Get bookings count
    const totalBookings = await Booking.countDocuments({ provider: req.provider.id });
    const completedBookings = await Booking.countDocuments({ 
      provider: req.provider.id,
      status: 'completed'
    });
    const pendingBookings = await Booking.countDocuments({ 
      provider: req.provider.id,
      status: 'pending'
    });
    const confirmedBookings = await Booking.countDocuments({ 
      provider: req.provider.id,
      status: 'confirmed'
    });

    // Get today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = await Booking.find({
      provider: req.provider.id,
      'scheduling.date': today
    }).populate('service', 'name').populate('user', 'fullName');

    // Get recent reviews
    const recentReviews = await Review.find({ provider: req.provider.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'fullName profilePicture');

    // Calculate earnings
    const completedBookingsWithPayment = await Booking.find({
      provider: req.provider.id,
      status: 'completed',
      'payment.status': 'paid'
    });

    const totalEarnings = completedBookingsWithPayment.reduce(
      (total, booking) => total + booking.payment.amount,
      0
    );

    res.json({
      success: true,
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        confirmedBookings,
        totalEarnings,
        rating: provider.rating || 0,
        todayBookingsCount: todayBookings.length
      },
      todayBookings,
      recentReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Login provider
// @route   POST /api/providers/login
// @access  Public
exports.loginProvider = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check if provider exists
    const provider = await Provider.findOne({ email }).select('+password');
    if (!provider) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(provider._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        serviceCategory: provider.serviceCategory,
        experience: provider.experience,
        profileImage: provider.profileImage,
        isVerified: provider.isVerified
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get provider profile
// @route   GET /api/providers/profile
// @access  Private (Provider only)
exports.getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id).select("-password");
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};