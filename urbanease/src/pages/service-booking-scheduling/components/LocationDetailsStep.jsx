import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LocationDetailsStep = ({ onNext, onBack, locationDetails, setLocationDetails }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.2167 }); // Delhi default

  const [formData, setFormData] = useState({
    address: locationDetails?.address || '',
    apartment: locationDetails?.apartment || '',
    city: locationDetails?.city || 'Delhi',
    state: locationDetails?.state || 'New Delhi',
    zipCode: locationDetails?.zipCode || '',
    specialInstructions: locationDetails?.specialInstructions || '',
    contactPhone: locationDetails?.contactPhone || '',
    alternateContact: locationDetails?.alternateContact || '',
    accessInstructions: locationDetails?.accessInstructions || '',
    ...locationDetails
  });

  const [errors, setErrors] = useState({});

  const savedAddresses = [
    {
      id: 1,
      label: 'Home',
      address: 'Auchandi Bawana Rd',
      apartment: 'Apt 4B',
      city: 'Delhi',
      state: 'New Delhi',
      zipCode: '110039',
      icon: 'Home'
    },
    {
      id: 2,
      label: 'Work',
      address: 'Jhandewalan Extension',
      apartment: 'Third Floor',
      city: 'Delhi',
      state: 'New Delhi',
      zipCode: '110055',
      icon: 'Building'
    },
    {
      id: 3,
      label: 'Mom\'s House',
      address: 'Dharam Marg',
      apartment: '3A',
      city: 'Delhi',
      state: 'New Delhi',
      zipCode: '110058',
      icon: 'Heart'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSavedAddressSelect = (address) => {
    setFormData(prev => ({
      ...prev,
      address: address.address,
      apartment: address.apartment,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    }));
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          
          // Simulate reverse geocoding
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              address: 'Connaught Place 1-A',
              city: 'Delhi',
              state: 'New Delhi',
              zipCode: '110001'
            }));
            setUseCurrentLocation(true);
            setIsDetectingLocation(false);
          }, 1500);
        },
        (error) => {
          console.error('Error detecting location:', error);
          setIsDetectingLocation(false);
        }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setLocationDetails(formData);
      onNext(formData);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Service Location & Details</h2>

      {/* Saved Addresses */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Saved Addresses</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {savedAddresses.map((address) => (
            <button
              key={address.id}
              onClick={() => handleSavedAddressSelect(address)}
              className="flex items-start space-x-3 p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name={address.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{address.label}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {address.address}
                  {address.apartment && `, ${address.apartment}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.zipCode}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Location */}
      <div className="bg-muted/50 rounded-lg p-4">
        <Button
          variant="outline"
          onClick={handleDetectLocation}
          disabled={isDetectingLocation}
          loading={isDetectingLocation}
          iconName={isDetectingLocation ? "Loader2" : "MapPin"}
          iconPosition="left"
          className="w-full justify-start"
        >
          {isDetectingLocation ? 'Detecting Location...' : 'Use Current Location'}
        </Button>
      </div>

      {/* Address Form */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Address Details</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Street Address"
              type="text"
              placeholder="Enter your street address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              required
            />
          </div>
          
          <Input
            label="Apartment/Suite"
            type="text"
            placeholder="Apt, Suite, Unit (optional)"
            value={formData.apartment}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
          />
          
          <Input
            label="City"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            required
          />
          
          <Input
            label="State"
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            error={errors.state}
            required
          />
          
          <Input
            label="ZIP Code"
            type="text"
            placeholder="12345"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            error={errors.zipCode}
            required
          />
        </div>
      </div>

      {/* Map Preview */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Location Preview</h3>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Service Location"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=14&output=embed`}
            className="border-0"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Contact Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Contact Phone"
            type="tel"
            placeholder="(91) 123-4567"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', formatPhoneNumber(e.target.value))}
            error={errors.contactPhone}
            required
            description="Primary contact number for the service provider"
          />
          
          <Input
            label="Alternate Contact"
            type="tel"
            placeholder="(91) 987-6543"
            value={formData.alternateContact}
            onChange={(e) => handleInputChange('alternateContact', formatPhoneNumber(e.target.value))}
            description="Optional backup contact number"
          />
        </div>
      </div>

      {/* Special Instructions */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Additional Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Access Instructions
          </label>
          <textarea
            placeholder="How should the service provider access your location? (e.g., gate code, parking instructions, etc.)"
            value={formData.accessInstructions}
            onChange={(e) => handleInputChange('accessInstructions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Special Instructions
          </label>
          <textarea
            placeholder="Any special requirements or instructions for the service provider..."
            value={formData.specialInstructions}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Schedule
        </Button>
        
        <Button
          onClick={handleNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default LocationDetailsStep;