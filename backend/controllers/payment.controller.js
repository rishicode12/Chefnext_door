const { validationResult } = require('express-validator');
const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretKey);
const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Provider = require('../providers/provider.model');
const { v4: uuidv4 } = require('uuid');


exports.getStripeConfig = async (req, res) => {
  res.json({
    success: true,
    publishableKey: config.stripePublishableKey
  });
};


exports.createPaymentIntent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookingId, paymentMethodId } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to pay for this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    // Check if booking is already paid
    if (booking.payment.status === 'paid' || booking.payment.status === 'completed') {
      return res.status(400).json({ message: 'Booking is already paid' });
    }

    // Get provider details for payment
    const provider = await Provider.findById(booking.provider);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if provider has Stripe account
    if (!provider.stripeAccountId) {
      return res.status(400).json({ message: 'Provider payment setup is incomplete' });
    }

    // Calculate amount in paise (Indian currency)
    const amount = Math.round(booking.payment.amount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      payment_method: paymentMethodId,
      confirm: false,
      application_fee_amount: Math.round(amount * 0.05), // 5% platform fee
      transfer_data: {
        destination: provider.stripeAccountId,
      },
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        providerId: provider._id.toString(),
        integration_check: 'accept_a_payment'
      }
    });

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      provider: booking.provider,
      booking: booking._id,
      amount: {
        currency: 'INR',
        value: booking.payment.amount,
        breakdown: booking.payment.breakdown
      },
      paymentMethod: paymentMethodId,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        bookingNumber: booking.bookingNumber
      }
    });

    await payment.save();

    // Update booking with payment intent ID
    booking.payment.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: payment._id
    });
  } catch (err) {
    console.error('Payment intent error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Payment processing error',
      error: err.message
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm-payment
// @access  Private (User only)
exports.confirmPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentIntentId } = req.body;

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    // Find the payment in our database
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Check if user is authorized to confirm this payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to confirm this payment' });
    }

    // Confirm the payment intent if it's not already confirmed
    if (paymentIntent.status !== 'succeeded') {
      const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      
      // If confirmation was successful, update our records
      if (confirmedIntent.status === 'succeeded') {
        payment.status = 'completed';
        await payment.save();

        // Update booking status
        const booking = await Booking.findById(payment.booking);
        if (booking) {
          booking.payment.status = 'completed';
          booking.status = 'confirmed';
          booking.statusHistory.push({
            status: 'confirmed',
            timestamp: new Date(),
            note: 'Payment confirmed by user'
          });
          await booking.save();
        }

        return res.json({
          success: true,
          message: 'Payment confirmed successfully',
          payment: {
            id: payment._id,
            status: payment.status,
            amount: payment.amount
          }
        });
      } else {
        // Payment confirmation failed
        return res.status(400).json({
          success: false,
          message: 'Payment confirmation failed',
          status: confirmedIntent.status
        });
      }
    } else {
      // Payment was already confirmed
      return res.json({
        success: true,
        message: 'Payment was already confirmed',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount
        }
      });
    }
  } catch (err) {
    console.error('Payment confirmation error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: err.message
    });
  }
};

// @desc    Process a refund
// @route   POST /api/payments/refund
// @access  Private (Provider only)
exports.processRefund = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentId, amount, reason } = req.body;

    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if provider is authorized to refund this payment
    if (payment.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to refund this payment' });
    }

    // Check if payment is completed
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: `Cannot refund a payment with status: ${payment.status}` });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer',
      metadata: {
        reason,
        providerId: req.provider.id,
        paymentId: payment._id.toString()
      }
    });

    // Update payment status
    const refundAmount = amount;
    const isFullRefund = refundAmount >= payment.amount.value;
    
    payment.status = isFullRefund ? 'refunded' : 'partially_refunded';
    payment.refunds.push({
      amount: refundAmount,
      reason,
      status: 'processed',
      stripeRefundId: refund.id,
      createdAt: new Date()
    });
    
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.payment.status = payment.status;
      booking.payment.refundAmount = refundAmount;
      booking.payment.refundReason = reason;
      booking.payment.refundDate = new Date();

      if (isFullRefund && booking.status !== 'cancelled') {
        booking.status = 'cancelled';
        booking.statusHistory.push({
          status: 'cancelled',
          timestamp: new Date(),
          note: `Booking cancelled and refunded: ${reason}`
        });
      } else if (!isFullRefund) {
        booking.statusHistory.push({
          status: booking.status,
          timestamp: new Date(),
          note: `Partial refund processed: ${reason}`
        });
      }

      await booking.save();
    }

    res.json({
      success: true,
      message: isFullRefund ? 'Full refund processed successfully' : 'Partial refund processed successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: refund.status
      }
    });
  } catch (err) {
    console.error('Refund error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: err.message
    });
  }
};

// @desc    Handle Stripe webhook events
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  // Since we removed the webhook secret, we'll just use the raw event data
  // Note: In production, you should validate webhooks using signatures
  try {
    const event = req.body;

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        await handleFailedPayment(failedPaymentIntent);
        break;
      case 'charge.refunded':
        const refund = event.data.object;
        await handleRefund(refund);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// Helper function to handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
  try {
    // Find the payment by payment intent ID
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update payment status
    payment.status = 'completed';
    await payment.save();

    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.payment.status = 'completed';
      booking.status = 'confirmed';
      booking.statusHistory.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Payment completed successfully'
      });
      await booking.save();
    }
  } catch (err) {
    console.error('Error handling successful payment:', err.message);
  }
}

// Helper function to handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    // Find the payment by payment intent ID
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update payment status
    payment.status = 'failed';
    await payment.save();

    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.payment.status = 'failed';
      booking.statusHistory.push({
        status: booking.status,
        timestamp: new Date(),
        note: 'Payment failed'
      });
      await booking.save();
    }
  } catch (err) {
    console.error('Error handling failed payment:', err.message);
  }
}

// Helper function to handle refund
async function handleRefund(refund) {
  try {
    // Find the payment by charge ID
    const payment = await Payment.findOne({ 'metadata.chargeId': refund.id });
    if (!payment) {
      console.error('Payment not found for charge:', refund.id);
      return;
    }

    // Update payment status
    payment.status = refund.amount_refunded === refund.amount ? 'refunded' : 'partially_refunded';
    payment.refunds.push({
      amount: refund.amount_refunded / 100,
      reason: refund.reason || 'No reason provided',
      status: 'processed',
      stripeRefundId: refund.id,
      createdAt: new Date(refund.created * 1000)
    });
    await payment.save();

    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.payment.status = payment.status;
      booking.payment.refundAmount = refund.amount_refunded / 100;
      booking.payment.refundDate = new Date(refund.created * 1000);
      booking.payment.refundReason = refund.reason || 'No reason provided';
      
      if (booking.status !== 'cancelled') {
        booking.status = 'cancelled';
        booking.statusHistory.push({
          status: 'cancelled',
          timestamp: new Date(refund.created * 1000),
          note: `Booking cancelled and refunded: ${refund.reason || 'No reason provided'}`
        });
      }
      
      await booking.save();
    }
  } catch (err) {
    console.error('Error handling refund:', err.message);
  }
}

// @desc    Confirm payment
// @route   POST /api/payments/confirm-payment
// @access  Private (User only)
exports.confirmPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    // Find payment record
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Check if user is authorized
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to confirm this payment' });
    }

    // Find booking
    const booking = await Booking.findById(payment.booking);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check payment intent status
    if (paymentIntent.status === 'succeeded') {
      // Update payment record
      payment.status = 'completed';
      payment.transactionId = paymentIntent.id;
      payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url || null;
      payment.completedAt = Date.now();
      await payment.save();

      // Update booking payment status
      booking.payment.status = 'paid';
      booking.payment.transactionId = paymentIntent.id;
      booking.payment.paidAt = Date.now();
      
      // If booking was pending, update to confirmed
      if (booking.status === 'pending') {
        booking.status = 'confirmed';
        booking.statusHistory.push({
          status: 'confirmed',
          timestamp: Date.now(),
          note: 'Booking confirmed after payment'
        });
      }
      
      await booking.save();

      return res.json({
        success: true,
        message: 'Payment confirmed successfully',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount.value,
          receiptUrl: payment.receiptUrl
        }
      });
    } else if (paymentIntent.status === 'requires_payment_method') {
      // Payment failed
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again with a different payment method.',
        paymentIntentStatus: paymentIntent.status
      });
    } else {
      // Payment is still processing or in another state
      return res.json({
        success: true,
        message: 'Payment is being processed',
        paymentIntentStatus: paymentIntent.status
      });
    }
  } catch (err) {
    console.error('Payment confirmation error:', err.message);
    res.status(500).json({ message: 'Payment confirmation error', error: err.message });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private (Provider only)
exports.processRefund = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookingId, amount, reason } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if provider is authorized
    if (booking.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to process refund for this booking' });
    }

    // Check if booking is paid
    if (booking.payment.status !== 'paid' && booking.payment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund unpaid booking' });
    }

    // Check if payment has Stripe payment intent ID
    if (!booking.payment.stripePaymentIntentId) {
      return res.status(400).json({ message: 'No payment intent found for this booking' });
    }

    // Find payment record
    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Check if payment is already refunded
    if (payment.refund && payment.refund.status === 'completed') {
      return res.status(400).json({ message: 'Payment is already refunded' });
    }

    // Calculate refund amount in paise
    const refundAmount = Math.round(amount * 100);
    const originalAmount = Math.round(booking.payment.amount * 100);

    // Validate refund amount
    if (refundAmount <= 0 || refundAmount > originalAmount) {
      return res.status(400).json({ message: 'Invalid refund amount' });
    }

    // Process refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.payment.stripePaymentIntentId,
      amount: refundAmount,
      reason: 'requested_by_customer',
      metadata: {
        bookingId: booking._id.toString(),
        providerId: req.provider.id,
        reason
      }
    });

    // Update payment record with refund details
    payment.refund = {
      amount: amount,
      reason,
      status: 'completed',
      stripeRefundId: refund.id,
      processedAt: Date.now()
    };
    await payment.save();

    // Update booking status if full refund
    if (refundAmount === originalAmount) {
      booking.status = 'cancelled';
      booking.statusHistory.push({
        status: 'cancelled',
        timestamp: Date.now(),
        note: `Cancelled with full refund: ${reason}`
      });
      booking.cancellation = {
        reason,
        cancelledBy: 'provider',
        cancellationFee: 0,
        timestamp: Date.now()
      };
    } else {
      // Add partial refund note to status history
      booking.statusHistory.push({
        status: booking.status,
        timestamp: Date.now(),
        note: `Partial refund of ₹${amount} processed: ${reason}`
      });
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: amount,
        status: 'completed'
      }
    });
  } catch (err) {
    console.error('Refund processing error:', err.message);
    res.status(500).json({ message: 'Refund processing error', error: err.message });
  }
};



// Helper function to handle successful payment
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { bookingId } = paymentIntent.metadata;

    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Find payment record
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!payment) {
      console.error('Payment record not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update payment record
    payment.status = 'completed';
    payment.transactionId = paymentIntent.id;
    payment.receiptUrl = paymentIntent.charges.data[0]?.receipt_url || null;
    payment.completedAt = Date.now();
    await payment.save();

    // Find and update booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error('Booking not found for ID:', bookingId);
      return;
    }

    // Update booking payment status
    booking.payment.status = 'paid';
    booking.payment.transactionId = paymentIntent.id;
    booking.payment.paidAt = Date.now();
    
    // If booking was pending, update to confirmed
    if (booking.status === 'pending') {
      booking.status = 'confirmed';
      booking.statusHistory.push({
        status: 'confirmed',
        timestamp: Date.now(),
        note: 'Booking confirmed after payment'
      });
    }
    
    await booking.save();

    console.log(`Payment for booking ${bookingId} processed successfully`);
  } catch (err) {
    console.error('Error handling successful payment:', err.message);
  }
}

// Helper function to handle failed payment
async function handleFailedPayment(paymentIntent) {
  try {
    const { bookingId } = paymentIntent.metadata;

    if (!bookingId) {
      console.error('No booking ID in payment intent metadata');
      return;
    }

    // Find payment record
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!payment) {
      console.error('Payment record not found for payment intent:', paymentIntent.id);
      return;
    }

    // Update payment record
    payment.status = 'failed';
    await payment.save();

    console.log(`Payment for booking ${bookingId} failed`);
  } catch (err) {
    console.error('Error handling failed payment:', err.message);
  }
}

// Helper function to handle refund
async function handleRefund(charge) {
  try {
    // Find payment by charge ID
    const payment = await Payment.findOne({ 'stripeChargeId': charge.id });
    if (!payment) {
      console.error('Payment record not found for charge:', charge.id);
      return;
    }

    // Update refund status if not already completed
    if (!payment.refund || payment.refund.status !== 'completed') {
      payment.refund = {
        amount: charge.amount_refunded / 100, // Convert from paise to rupees
        status: 'completed',
        stripeRefundId: charge.refunds.data[0]?.id,
        processedAt: Date.now()
      };
      await payment.save();
    }

    console.log(`Refund for payment ${payment._id} processed successfully`);
  } catch (err) {
    console.error('Error handling refund:', err.message);
  }
}

// @desc    Get user payment history
// @route   GET /api/payments/user/history
// @access  Private (User only)
exports.getUserPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking', 'bookingNumber status scheduling')
      .populate('provider', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get provider payment history
// @route   GET /api/payments/provider/history
// @access  Private (Provider only)
exports.getProviderPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ provider: req.provider.id })
      .populate('booking', 'bookingNumber status scheduling')
      .populate('user', 'fullName profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private (User or Provider)
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('booking', 'bookingNumber status scheduling bookingDetails')
      .populate('provider', 'name profilePicture email phone')
      .populate('user', 'fullName profilePicture email phone');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user or provider is authorized to view this payment
    if (
      (req.role === 'user' && payment.user.toString() !== req.user.id) ||
      (req.role === 'provider' && payment.provider.toString() !== req.provider.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    res.json({
      success: true,
      payment
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create setup intent for saving payment method
// @route   POST /api/payments/setup-intent
// @access  Private (User only)
exports.createSetupIntent = async (req, res) => {
  try {
    // Find or create customer in Stripe
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user doesn't have a Stripe customer ID, create one
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        phone: user.phone,
        metadata: {
          userId: user._id.toString()
        }
      });

      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      usage: 'off_session',
      metadata: {
        userId: user._id.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    });
  } catch (err) {
    console.error('Setup intent error:', err.message);
    res.status(500).json({ message: 'Payment setup error', error: err.message });
  }
};

// @desc    Save payment method
// @route   POST /api/payments/save-payment-method
// @access  Private (User only)
exports.savePaymentMethod = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentMethodId, isDefault } = req.body;

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify payment method exists in Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Attach payment method to customer if not already attached
    if (paymentMethod.customer !== user.stripeCustomerId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });
    }

    // Get payment method details
    const { card } = paymentMethod;
    const last4 = card.last4;
    const brand = card.brand;
    const expMonth = card.exp_month;
    const expYear = card.exp_year;

    // Check if payment method already exists
    const existingMethodIndex = user.paymentMethods.findIndex(
      method => method.paymentMethodId === paymentMethodId
    );

    if (existingMethodIndex !== -1) {
      // Update existing payment method
      user.paymentMethods[existingMethodIndex] = {
        paymentMethodId,
        type: 'card',
        details: {
          brand,
          last4,
          expiryMonth: expMonth,
          expiryYear: expYear
        },
        isDefault: isDefault || false
      };
    } else {
      // Add new payment method
      const newPaymentMethod = {
        paymentMethodId,
        type: 'card',
        details: {
          brand,
          last4,
          expiryMonth: expMonth,
          expiryYear: expYear
        },
        isDefault: isDefault || false
      };

      user.paymentMethods.push(newPaymentMethod);
    }

    // If this is the default payment method, update other methods
    if (isDefault) {
      user.paymentMethods.forEach((method, index) => {
        if (method.paymentMethodId !== paymentMethodId) {
          user.paymentMethods[index].isDefault = false;
        }
      });
    }

    // If this is the first payment method, make it default
    if (user.paymentMethods.length === 1) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Payment method saved successfully',
      paymentMethod: user.paymentMethods.find(method => method.paymentMethodId === paymentMethodId)
    });
  } catch (err) {
    console.error('Save payment method error:', err.message);
    res.status(500).json({ message: 'Error saving payment method', error: err.message });
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payments/payment-methods/:paymentMethodId
// @access  Private (User only)
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if payment method exists
    const methodIndex = user.paymentMethods.findIndex(
      method => method.paymentMethodId === paymentMethodId
    );

    if (methodIndex === -1) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Check if it's the default method
    const isDefault = user.paymentMethods[methodIndex].isDefault;

    // Detach payment method from Stripe
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
    } catch (stripeErr) {
      console.error('Stripe detach error:', stripeErr.message);
      // Continue even if Stripe detach fails
    }

    // Remove payment method from user
    user.paymentMethods.splice(methodIndex, 1);

    // If deleted method was default and other methods exist, set a new default
    if (isDefault && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (err) {
    console.error('Delete payment method error:', err.message);
    res.status(500).json({ message: 'Error deleting payment method', error: err.message });
  }
};

// @desc    Get user payment methods
// @route   GET /api/payments/payment-methods
// @access  Private (User only)
exports.getUserPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('paymentMethods');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      paymentMethods: user.paymentMethods
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};