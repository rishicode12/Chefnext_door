const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protectUser, protectProvider, protectAny } = require('../middleware/authMiddleware');

// Import controller
const bookingController = require('../controllers/booking.controller');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User only)
router.post(
  '/',
  [
    check('serviceId', 'Service ID is required').not().isEmpty(),
    check('providerId', 'Provider ID is required').not().isEmpty(),
    check('date', 'Date is required').isISO8601().toDate(),
    check('time', 'Time is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty()
  ],
  protectUser,
  bookingController.createBooking
);

// @route   GET /api/bookings/:bookingId
// @desc    Get booking by ID
// @access  Private (User or Provider)
router.get('/:bookingId', protectAny, bookingController.getBookingById);

// @route   PUT /api/bookings/:bookingId/status
// @desc    Update booking status
// @access  Private (Provider only)
router.put(
  '/:bookingId/status',
  [
    check('status', 'Status is required').isIn([
      'pending',
      'confirmed',
      'in-progress',
      'completed',
      'cancelled',
      'no-show'
    ])
  ],
  protectProvider,
  bookingController.updateBookingStatus
);

// @route   POST /api/bookings/:bookingId/cancel
// @desc    Cancel booking
// @access  Private (User only)
router.post(
  '/:bookingId/cancel',
  [
    check('reason', 'Reason is required').not().isEmpty()
  ],
  protectUser,
  bookingController.cancelBooking
);

// @route   POST /api/bookings/:bookingId/reschedule
// @desc    Reschedule booking
// @access  Private (User only)
router.post(
  '/:bookingId/reschedule',
  [
    check('date', 'Date is required').isISO8601().toDate(),
    check('time', 'Time is required').not().isEmpty()
  ],
  protectUser,
  bookingController.rescheduleBooking
);

// @route   POST /api/bookings/:bookingId/payment
// @desc    Process payment for booking
// @access  Private (User only)
router.post(
  '/:bookingId/payment',
  [
    check('paymentMethodId', 'Payment method ID is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric()
  ],
  protectUser,
  bookingController.processPayment
);

// @route   GET /api/bookings/user/upcoming
// @desc    Get user's upcoming bookings
// @access  Private (User only)
router.get('/user/upcoming', protectUser, bookingController.getUserUpcomingBookings);

// @route   GET /api/bookings/user/past
// @desc    Get user's past bookings
// @access  Private (User only)
router.get('/user/past', protectUser, bookingController.getUserPastBookings);

// @route   GET /api/bookings/provider/upcoming
// @desc    Get provider's upcoming bookings
// @access  Private (Provider only)
router.get('/provider/upcoming', protectProvider, bookingController.getProviderUpcomingBookings);

// @route   GET /api/bookings/provider/past
// @desc    Get provider's past bookings
// @access  Private (Provider only)
router.get('/provider/past', protectProvider, bookingController.getProviderPastBookings);

// @route   GET /api/bookings/provider/today
// @desc    Get provider's bookings for today
// @access  Private (Provider only)
router.get('/provider/today', protectProvider, bookingController.getProviderTodayBookings);

// @route   POST /api/bookings/:bookingId/notes
// @desc    Add provider notes to booking
// @access  Private (Provider only)
router.post(
  '/:bookingId/notes',
  [
    check('notes', 'Notes are required').not().isEmpty()
  ],
  protectProvider,
  bookingController.addBookingNotes
);

module.exports = router;