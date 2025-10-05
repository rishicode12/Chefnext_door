const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Review = require('../models/review.model');
const config = require('../config/config');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, phone } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    user = new User({
      fullName,
      email,
      password,
      phone,
      verification: {
        otp,
        otpExpiry
      }
    });

    // Save user to database
    await user.save();

    // In a real application, send OTP via email or SMS
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your account with the OTP sent to your email/phone.',
      userId: user._id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is valid and not expired
    if (
      user.verification.otp !== otp ||
      new Date() > new Date(user.verification.otpExpiry)
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verification.otp = undefined;
    user.verification.otpExpiry = undefined;

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      config.jwtSecret,
      { expiresIn: config.jwtExpire }
    );

    res.json({
      success: true,
      message: 'Account verified successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.verification.otp = otp;
      user.verification.otpExpiry = otpExpiry;

      await user.save();

      // In a real application, send OTP via email or SMS
      console.log(`OTP for ${email}: ${otp}`);

      return res.status(400).json({
        message: 'Account not verified. A new OTP has been sent to your email/phone.',
        requiresVerification: true,
        userId: user._id
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiry;

    await user.save();

    // In a real application, send reset link via email
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      profilePicture,
      preferences,
      emergencyContact
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;
    
    // Update preferences if provided
    if (preferences) {
      if (preferences.serviceCategories) user.preferences.serviceCategories = preferences.serviceCategories;
      if (preferences.notifications) user.preferences.notifications = preferences.notifications;
      if (preferences.language) user.preferences.language = preferences.language;
      if (preferences.accessibility) user.preferences.accessibility = preferences.accessibility;
      if (preferences.privacy) user.preferences.privacy = preferences.privacy;
    }

    // Update emergency contact if provided
    if (emergencyContact) {
      user.emergencyContact = emergencyContact;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service', 'name category price duration')
      .populate('provider', 'name profilePicture rating')
      .sort({ createdAt: -1 });

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

// @desc    Get booking details
// @route   GET /api/users/bookings/:bookingId
// @access  Private
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user.id
    })
      .populate('service', 'name category price duration description options addons')
      .populate('provider', 'name profilePicture rating phone email description specialties badges');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   POST /api/users/bookings/:bookingId/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        message: `Booking cannot be cancelled as it is already ${booking.status}`
      });
    }

    // Calculate booking time
    const bookingTime = new Date(`${booking.date}T${booking.time}`);
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
      note: req.body.reason || 'Cancelled by user'
    });

    booking.cancellation = {
      reason: req.body.reason || 'Cancelled by user',
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
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add review for a booking
// @route   POST /api/users/bookings/:bookingId/review
// @access  Private
exports.addReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user.id,
      status: 'completed'
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found or not eligible for review'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: req.params.bookingId
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'Review already submitted for this booking'
      });
    }

    const {
      rating,
      title,
      comment,
      serviceQuality,
      punctuality,
      professionalism,
      valueForMoney,
      photos
    } = req.body;

    // Create new review
    const review = new Review({
      user: req.user.id,
      provider: booking.provider,
      service: booking.service,
      booking: booking._id,
      rating,
      title: title || `Review for service on ${new Date(booking.date).toLocaleDateString()}`,
      comment,
      qualityMetrics: {
        serviceQuality: serviceQuality || rating,
        punctuality: punctuality || rating,
        professionalism: professionalism || rating,
        valueForMoney: valueForMoney || rating
      },
      photos: photos || [],
      isVerified: true,
      isPublic: true
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user payment methods
// @route   GET /api/users/payment-methods
// @access  Private
exports.getPaymentMethods = async (req, res) => {
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

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
exports.addPaymentMethod = async (req, res) => {
  try {
    const {
      type,
      cardNumber,
      nameOnCard,
      expiryDate,
      isDefault,
      upiId,
      walletType
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create payment method object based on type
    const paymentMethod = {
      _id: uuidv4(),
      type,
      isDefault: isDefault || false
    };

    // Add type-specific details
    if (type === 'card') {
      if (!cardNumber || !nameOnCard || !expiryDate) {
        return res.status(400).json({
          message: 'Card details are required'
        });
      }

      // In a real app, you would validate and tokenize the card using Stripe
      paymentMethod.card = {
        last4: cardNumber.slice(-4),
        nameOnCard,
        expiryDate
      };
    } else if (type === 'upi') {
      if (!upiId) {
        return res.status(400).json({
          message: 'UPI ID is required'
        });
      }

      paymentMethod.upi = { id: upiId };
    } else if (type === 'wallet') {
      if (!walletType) {
        return res.status(400).json({
          message: 'Wallet type is required'
        });
      }

      paymentMethod.wallet = { type: walletType };
    } else {
      return res.status(400).json({
        message: 'Invalid payment method type'
      });
    }

    // If this is the default payment method, unset default for all others
    if (isDefault) {
      user.paymentMethods.forEach(method => {
        method.isDefault = false;
      });
    }

    // Add the new payment method
    user.paymentMethods.push(paymentMethod);

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      paymentMethod
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods/:paymentMethodId
// @access  Private
exports.deletePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the payment method
    const paymentMethodIndex = user.paymentMethods.findIndex(
      method => method._id.toString() === req.params.paymentMethodId
    );

    if (paymentMethodIndex === -1) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Check if it's the default payment method
    const isDefault = user.paymentMethods[paymentMethodIndex].isDefault;

    // Remove the payment method
    user.paymentMethods.splice(paymentMethodIndex, 1);

    // If it was the default and there are other payment methods, set a new default
    if (isDefault && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
exports.addUserAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      type,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
      label
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create address object
    const address = {
      _id: uuidv4(),
      type: type || 'home',
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: isDefault || false,
      label: label || type || 'home'
    };

    // If this is the default address, unset default for all others
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add the new address
    user.addresses.push(address);

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateUserAddress = async (req, res) => {
  try {
    const {
      type,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
      label
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the address
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Update address fields
    if (type) address.type = type;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;
    if (label) address.label = label;

    // Handle default address
    if (isDefault && !address.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      address
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the address
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Check if it's the default address
    const isDefault = user.addresses[addressIndex].isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If it was the default and there are other addresses, set a new default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};