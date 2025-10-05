const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protectUser, protectProvider } = require('../middleware/authMiddleware');

// Import controller
const serviceController = require('../controllers/service.controller');

// @route   GET /api/services
// @desc    Get all services with filters
// @access  Public
router.get('/', serviceController.getAllServices);

// @route   GET /api/services/categories
// @desc    Get all service categories
// @access  Public
router.get('/categories', serviceController.getServiceCategories);

// @route   GET /api/services/:serviceId
// @desc    Get service by ID
// @access  Public
router.get('/:serviceId', serviceController.getServiceById);

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Provider only)
router.post(
  '/',
  [
    check('name', 'Service name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('duration', 'Duration is required').isNumeric()
  ],
  protectProvider,
  serviceController.createService
);

// @route   PUT /api/services/:serviceId
// @desc    Update a service
// @access  Private (Provider only)
router.put(
  '/:serviceId',
  [
    check('name', 'Service name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('duration', 'Duration is required').isNumeric()
  ],
  protectProvider,
  serviceController.updateService
);

// @route   DELETE /api/services/:serviceId
// @desc    Delete a service
// @access  Private (Provider only)
router.delete('/:serviceId', protectProvider, serviceController.deleteService);

// @route   GET /api/services/search/:query
// @desc    Search services
// @access  Public
router.get('/search/:query', serviceController.searchServices);

// @route   GET /api/services/provider/:providerId
// @desc    Get services by provider ID
// @access  Public
router.get('/provider/:providerId', serviceController.getServicesByProvider);

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get('/category/:category', serviceController.getServicesByCategory);

// @route   POST /api/services/:serviceId/options
// @desc    Add option to service
// @access  Private (Provider only)
router.post(
  '/:serviceId/options',
  [
    check('name', 'Option name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric()
  ],
  protectProvider,
  serviceController.addServiceOption
);

// @route   DELETE /api/services/:serviceId/options/:optionId
// @desc    Remove option from service
// @access  Private (Provider only)
router.delete('/:serviceId/options/:optionId', protectProvider, serviceController.removeServiceOption);

// @route   POST /api/services/:serviceId/addons
// @desc    Add addon to service
// @access  Private (Provider only)
router.post(
  '/:serviceId/addons',
  [
    check('name', 'Addon name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('description', 'Description is required').not().isEmpty()
  ],
  protectProvider,
  serviceController.addServiceAddon
);

// @route   DELETE /api/services/:serviceId/addons/:addonId
// @desc    Remove addon from service
// @access  Private (Provider only)
router.delete('/:serviceId/addons/:addonId', protectProvider, serviceController.removeServiceAddon);

// @route   PUT /api/services/:serviceId/availability
// @desc    Update service availability
// @access  Private (Provider only)
router.put('/:serviceId/availability', protectProvider, serviceController.updateServiceAvailability);

module.exports = router;