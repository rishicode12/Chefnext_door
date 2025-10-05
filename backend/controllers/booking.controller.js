const { validationResult } = require('express-validator');
const Booking = require('../models/booking.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');
const Provider = require('../providers/provider.model');


exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      serviceId,
      providerId,
      date,
      time,
      location,
      selectedOptions,
      selectedAddons,
      specialInstructions,
      paymentMethod
    } = req.body;

    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    
    const startTime = time;
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    
    let basePrice = service.price;
    let optionsPrice = 0;
    let addonsPrice = 0;

    
    if (selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach(optionId => {
        const option = service.options.find(opt => opt._id.toString() === optionId);
        if (option) {
          optionsPrice += option.price;
        }
      });
    }

    
    if (selectedAddons && selectedAddons.length > 0) {
      selectedAddons.forEach(addonId => {
        const addon = service.addons.find(add => add._id.toString() === addonId);
        if (addon) {
          addonsPrice += addon.price;
        }
      });
    }

    
    const subtotal = basePrice + optionsPrice + addonsPrice;
    const tax = subtotal * 0.18; 
    const serviceFee = subtotal * 0.05; 
    const total = subtotal + tax + serviceFee;

    
    const booking = new Booking({
      user: req.user.id,
      provider: providerId,
      service: serviceId,
      bookingDetails: {
        serviceDetails: {
          name: service.name,
          category: service.category,
          basePrice,
          duration: service.duration
        },
        selectedOptions: selectedOptions || [],
        selectedAddons: selectedAddons || []
      },
      scheduling: {
        date,
        time: startTime,
        endTime
      },
      location,
      specialInstructions: specialInstructions || '',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: Date.now(),
          note: 'Booking created'
        }
      ],
      payment: {
        amount: total,
        currency: 'INR',
        breakdown: {
          basePrice,
          optionsPrice,
          addonsPrice,
          subtotal,
          tax,
          serviceFee
        },
        status: 'pending',
        method: paymentMethod || 'pending'
      }
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('service', 'name category price duration description options addons')
      .populate('provider', 'name profilePicture rating phone email description specialties badges')
      .populate('user', 'fullName email phone profilePicture');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (
      (req.role === 'user' && booking.user._id.toString() !== req.user.id) ||
      (req.role === 'provider' && booking.provider._id.toString() !== req.provider.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:bookingId/status
// @access  Private (Provider only)
exports.updateBookingStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status, note } = req.body;

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the provider is authorized to update this booking
    if (booking.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Check if the status transition is valid
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled', 'no-show'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': [],
      'no-show': []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${booking.status} to ${status}`
      });
    }

    // Update booking status
    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: Date.now(),
      note: note || `Status updated to ${status} by provider`
    });

    // If status is completed, update payment status
    if (status === 'completed' && booking.payment.status === 'paid') {
      booking.payment.status = 'completed';
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      status: booking.status,
      statusHistory: booking.statusHistory
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


exports.cancelBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to cancel this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no-show') {
      return res.status(400).json({
        message: `Booking cannot be cancelled as it is already ${booking.status}`
      });
    }

    // Calculate booking time
    const bookingTime = new Date(`${booking.scheduling.date}T${booking.scheduling.time}`);
    const currentTime = new Date();
    const timeDiff = bookingTime - currentTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Set cancellation fee based on how close to booking time
    let cancellationFee = 0;
    if (hoursDiff < 2) {
      cancellationFee = booking.payment.amount * 0.5; // 50% fee if cancelled less than 2 hours before
    } else if (hoursDiff < 24) {
      cancellationFee = booking.payment.amount * 0.2; // 20% fee if cancelled less than 24 hours before
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.statusHistory.push({
      status: 'cancelled',
      timestamp: Date.now(),
      note: `Cancelled by user: ${reason}`
    });

    booking.cancellation = {
      reason,
      cancelledBy: 'user',
      cancellationFee,
      timestamp: Date.now()
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      cancellationFee
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};


exports.rescheduleBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, time } = req.body;

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reschedule this booking' });
    }

    // Check if booking can be rescheduled
    if (booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no-show' || booking.status === 'in-progress') {
      return res.status(400).json({
        message: `Booking cannot be rescheduled as it is already ${booking.status}`
      });
    }

    // Calculate end time based on service duration
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + booking.bookingDetails.serviceDetails.duration);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    // Update booking scheduling
    booking.scheduling.date = date;
    booking.scheduling.time = time;
    booking.scheduling.endTime = endTime;

    // Add to status history
    booking.statusHistory.push({
      status: booking.status,
      timestamp: Date.now(),
      note: `Rescheduled by user from ${booking.scheduling.date} ${booking.scheduling.time} to ${date} ${time}`
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Booking rescheduled successfully',
      scheduling: booking.scheduling
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Process payment for booking
// @route   POST /api/bookings/:bookingId/payment
// @access  Private (User only)
exports.processPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentMethodId, amount } = req.body;

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to pay for this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    // Check if booking can be paid for
    if (booking.payment.status === 'paid' || booking.payment.status === 'completed') {
      return res.status(400).json({
        message: 'Payment has already been processed for this booking'
      });
    }

    // Verify amount matches booking amount
    if (amount !== booking.payment.amount) {
      return res.status(400).json({
        message: 'Payment amount does not match booking amount'
      });
    }

    // In a real application, process payment with Stripe or other payment gateway
    // For now, simulate successful payment
    const transactionId = `txn_${Date.now()}`;

    // Update booking payment details
    booking.payment.status = 'paid';
    booking.payment.method = paymentMethodId;
    booking.payment.transactionId = transactionId;
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

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment: {
        status: booking.payment.status,
        transactionId,
        amount: booking.payment.amount,
        method: booking.payment.method
      }
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's upcoming bookings
// @route   GET /api/bookings/user/upcoming
// @access  Private (User only)
exports.getUserUpcomingBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const bookings = await Booking.find({
      user: req.user.id,
      status: { $in: ['pending', 'confirmed'] },
      'scheduling.date': { $gte: currentDate.toISOString().split('T')[0] }
    })
      .populate('service', 'name category price duration')
      .populate('provider', 'name profilePicture rating')
      .sort({ 'scheduling.date': 1, 'scheduling.time': 1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's past bookings
// @route   GET /api/bookings/user/past
// @access  Private (User only)
exports.getUserPastBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const bookings = await Booking.find({
      user: req.user.id,
      $or: [
        { status: { $in: ['completed', 'cancelled', 'no-show'] } },
        {
          'scheduling.date': { $lt: currentDate.toISOString().split('T')[0] }
        }
      ]
    })
      .populate('service', 'name category price duration')
      .populate('provider', 'name profilePicture rating')
      .sort({ 'scheduling.date': -1, 'scheduling.time': -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get provider's upcoming bookings
// @route   GET /api/bookings/provider/upcoming
// @access  Private (Provider only)
exports.getProviderUpcomingBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const bookings = await Booking.find({
      provider: req.provider.id,
      status: { $in: ['pending', 'confirmed'] },
      'scheduling.date': { $gte: currentDate.toISOString().split('T')[0] }
    })
      .populate('service', 'name category price duration')
      .populate('user', 'fullName email phone profilePicture')
      .sort({ 'scheduling.date': 1, 'scheduling.time': 1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get provider's past bookings
// @route   GET /api/bookings/provider/past
// @access  Private (Provider only)
exports.getProviderPastBookings = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const bookings = await Booking.find({
      provider: req.provider.id,
      $or: [
        { status: { $in: ['completed', 'cancelled', 'no-show'] } },
        {
          'scheduling.date': { $lt: currentDate.toISOString().split('T')[0] }
        }
      ]
    })
      .populate('service', 'name category price duration')
      .populate('user', 'fullName email phone profilePicture')
      .sort({ 'scheduling.date': -1, 'scheduling.time': -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get provider's bookings for today
// @route   GET /api/bookings/provider/today
// @access  Private (Provider only)
exports.getProviderTodayBookings = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const bookings = await Booking.find({
      provider: req.provider.id,
      'scheduling.date': today
    })
      .populate('service', 'name category price duration')
      .populate('user', 'fullName email phone profilePicture')
      .sort({ 'scheduling.time': 1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add provider notes to booking
// @route   POST /api/bookings/:bookingId/notes
// @access  Private (Provider only)
exports.addBookingNotes = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { notes } = req.body;

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the provider is authorized to add notes to this booking
    if (booking.provider.toString() !== req.provider.id) {
      return res.status(403).json({ message: 'Not authorized to add notes to this booking' });
    }

    // Add provider notes
    booking.providerNotes = notes;

    await booking.save();

    res.json({
      success: true,
      message: 'Provider notes added successfully',
      notes: booking.providerNotes
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};