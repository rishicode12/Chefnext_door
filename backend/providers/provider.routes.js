const express = require("express");
const router = express.Router();
const { check } = require('express-validator');
const providerController = require("./provider.controller");
const { protectProvider } = require("../middleware/authMiddleware");

// @route   POST /api/providers/register
// @desc    Register a provider
// @access  Public
router.post(
  "/register", 
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('serviceCategory', 'Service category is required').not().isEmpty(),
    check('experience', 'Experience is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty()
  ],
  providerController.registerProvider
);

// @route   POST /api/providers/login
// @desc    Login provider
// @access  Public
router.post(
  "/login",
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  providerController.loginProvider
);

// @route   GET /api/providers/profile
// @desc    Get provider profile
// @access  Private (Provider only)
router.get("/profile", protectProvider, providerController.getProviderProfile);

// @route   PUT /api/providers/profile
// @desc    Update provider profile
// @access  Private (Provider only)
router.put("/profile", protectProvider, providerController.updateProviderProfile);

// @route   GET /api/providers/services
// @desc    Get provider services
// @access  Private (Provider only)
router.get("/services", protectProvider, providerController.getProviderServices);

// @route   GET /api/providers/bookings
// @desc    Get provider bookings
// @access  Private (Provider only)
router.get("/bookings", protectProvider, providerController.getProviderBookings);

// @route   PUT /api/providers/bookings/:bookingId/status
// @desc    Update booking status
// @access  Private (Provider only)
router.put("/bookings/:bookingId/status", protectProvider, providerController.updateBookingStatus);

// @route   GET /api/providers/reviews
// @desc    Get provider reviews
// @access  Private (Provider only)
router.get("/reviews", protectProvider, providerController.getProviderReviews);

// @route   POST /api/providers/reviews/:reviewId/respond
// @desc    Respond to a review
// @access  Private (Provider only)
router.post("/reviews/:reviewId/respond", protectProvider, providerController.respondToReview);

// @route   GET /api/providers/dashboard
// @desc    Get provider dashboard stats
// @access  Private (Provider only)
router.get("/dashboard", protectProvider, providerController.getProviderDashboard);

module.exports = router;