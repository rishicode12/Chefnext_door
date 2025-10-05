const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protectUser } = require('../middleware/authMiddleware');

// Import controller
const userController = require('../controllers/user.controller');

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  userController.registerUser
);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.loginUser
);

// @route   POST /api/users/verify-otp
// @desc    Verify OTP for registration
// @access  Public
router.post(
  '/verify-otp',
  [
    check('email', 'Email is required').isEmail(),
    check('otp', 'OTP is required').not().isEmpty()
  ],
  userController.verifyOTP
);

// @route   POST /api/users/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  userController.forgotPassword
);

// @route   POST /api/users/reset-password
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  userController.resetPassword
);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protectUser, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protectUser, userController.updateUserProfile);

// @route   GET /api/users/bookings
// @desc    Get user bookings
// @access  Private
router.get('/bookings', protectUser, userController.getUserBookings);

// @route   GET /api/users/bookings/:bookingId
// @desc    Get booking details
// @access  Private
router.get('/bookings/:bookingId', protectUser, userController.getBookingDetails);

// @route   POST /api/users/bookings/:bookingId/cancel
// @desc    Cancel booking
// @access  Private
router.post('/bookings/:bookingId/cancel', protectUser, userController.cancelBooking);

// @route   POST /api/users/bookings/:bookingId/review
// @desc    Add review for a booking
// @access  Private
router.post(
  '/bookings/:bookingId/review',
  [
    check('rating', 'Rating is required').isNumeric(),
    check('comment', 'Comment is required').not().isEmpty()
  ],
  protectUser,
  userController.addReview
);

// @route   GET /api/users/payment-methods
// @desc    Get user payment methods
// @access  Private
router.get('/payment-methods', protectUser, userController.getPaymentMethods);

// @route   POST /api/users/payment-methods
// @desc    Add payment method
// @access  Private
router.post('/payment-methods', protectUser, userController.addPaymentMethod);

// @route   DELETE /api/users/payment-methods/:paymentMethodId
// @desc    Delete payment method
// @access  Private
router.delete('/payment-methods/:paymentMethodId', protectUser, userController.deletePaymentMethod);

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', protectUser, userController.getUserAddresses);

// @route   POST /api/users/addresses
// @desc    Add user address
// @access  Private
router.post(
  '/addresses',
  [
    check('addressLine1', 'Address line 1 is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('postalCode', 'Postal code is required').not().isEmpty()
  ],
  protectUser,
  userController.addUserAddress
);

// @route   PUT /api/users/addresses/:addressId
// @desc    Update user address
// @access  Private
router.put('/addresses/:addressId', protectUser, userController.updateUserAddress);

// @route   DELETE /api/users/addresses/:addressId
// @desc    Delete user address
// @access  Private
router.delete('/addresses/:addressId', protectUser, userController.deleteUserAddress);

module.exports = router;