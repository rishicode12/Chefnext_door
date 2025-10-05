const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protectUser, protectProvider } = require('../middleware/authMiddleware');

// Import controller
const paymentController = require('../controllers/payment.controller');

// @route   GET /api/payments/config
// @desc    Get Stripe publishable key
// @access  Public
router.get('/config', paymentController.getStripeConfig);

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent
// @access  Private (User only)
router.post(
  '/create-payment-intent',
  [
    check('bookingId', 'Booking ID is required').not().isEmpty(),
    check('paymentMethodId', 'Payment method ID is required').not().isEmpty()
  ],
  protectUser,
  paymentController.createPaymentIntent
);

// @route   POST /api/payments/confirm-payment
// @desc    Confirm a payment
// @access  Private (User only)
router.post(
  '/confirm-payment',
  [
    check('paymentIntentId', 'Payment intent ID is required').not().isEmpty()
  ],
  protectUser,
  paymentController.confirmPayment
);

// @route   POST /api/payments/refund
// @desc    Process a refund
// @access  Private (Provider only)
router.post(
  '/refund',
  [
    check('paymentId', 'Payment ID is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('reason', 'Reason is required').not().isEmpty()
  ],
  protectProvider,
  paymentController.processRefund
);

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhook events
// @access  Public
router.post('/webhook', paymentController.handleWebhook);

// @route   GET /api/payments/user
// @desc    Get user payment history
// @access  Private (User only)
router.get('/user', protectUser, paymentController.getUserPaymentHistory);

// @route   GET /api/payments/provider
// @desc    Get provider payment history
// @access  Private (Provider only)
router.get('/provider', protectProvider, paymentController.getProviderPaymentHistory);

// @route   GET /api/payments/:paymentId
// @desc    Get payment details
// @access  Private (User or Provider)
router.get('/:paymentId', protectUser, paymentController.getPaymentDetails);

// @route   POST /api/payments/setup-intent
// @desc    Create a setup intent for saving payment method
// @access  Private (User only)
router.post('/setup-intent', protectUser, paymentController.createSetupIntent);

// @route   POST /api/payments/save-payment-method
// @desc    Save a payment method
// @access  Private (User only)
router.post(
  '/save-payment-method',
  [
    check('setupIntentId', 'Setup intent ID is required').not().isEmpty(),
    check('paymentMethodId', 'Payment method ID is required').not().isEmpty()
  ],
  protectUser,
  paymentController.savePaymentMethod
);

// @route   DELETE /api/payments/payment-methods/:paymentMethodId
// @desc    Delete a payment method
// @access  Private (User only)
router.delete('/payment-methods/:paymentMethodId', protectUser, paymentController.deletePaymentMethod);

// @route   GET /api/payments/payment-methods
// @desc    Get user payment methods
// @access  Private (User only)
router.get('/payment-methods', protectUser, paymentController.getUserPaymentMethods);

module.exports = router;