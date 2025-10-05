import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const PaymentConfirmationStep = ({ 
  onNext, 
  onBack, 
  selectedService, 
  selectedSchedule, 
  locationDetails,
  onBookingComplete 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});

  const savedCards = [
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true
    },
    {
      id: 2,
      type: 'rupay',
      last4: '5555',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'phone', name: 'PhonePay', icon: 'Wallet' },
    { id: 'bhim', name: 'Bhim UPI', icon: 'Smartphone' },
    { id: 'google', name: 'Google Pay', icon: 'Smartphone' }
  ];

  // Calculate pricing breakdown
  const calculatePricing = () => {
    const basePrice = selectedService?.price * (selectedService?.quantity || 1);
    const optionPrice = selectedService?.selectedOption?.price || 0;
    const addOnPrice = selectedService?.addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
    const subtotal = basePrice + optionPrice + addOnPrice;
    const tax = subtotal * 0.08; // 8% tax
    const serviceFee = 5.99;
    const total = subtotal + tax + serviceFee;

    return {
      basePrice,
      optionPrice,
      addOnPrice,
      subtotal,
      tax,
      serviceFee,
      total
    };
  };

  const pricing = calculatePricing();

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '₹10 ').trim();
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '₹10/₹20');
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardForm(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateCardForm = () => {
    const newErrors = {};
    
    if (!cardForm.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardForm.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardForm.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cardForm.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardForm.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!cardForm.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async () => {
    if (!acceptedPolicies) {
      alert('Please accept the cancellation policy to continue');
      return;
    }

    if (selectedPaymentMethod === 'card' && showNewCardForm) {
      if (!validateCardForm()) {
        return;
      }
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onBookingComplete({
        service: selectedService,
        schedule: selectedSchedule,
        location: locationDetails,
        payment: {
          method: selectedPaymentMethod,
          amount: pricing.total
        },
        bookingId: 'BK' + Date.now(),
        confirmationNumber: 'CNF' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    }, 3000);
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa': return 'CreditCard';
      case 'mastercard': return 'CreditCard';
      default: return 'CreditCard';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Review & Payment</h2>

      {/* Booking Summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          {/* Service Details */}
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <Image
                src={selectedService?.image}
                alt={selectedService?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{selectedService?.name}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedService?.selectedOption?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Quantity: {selectedService?.quantity || 1}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">₹{selectedService?.price}</p>
            </div>
          </div>

          {/* Add-ons */}
          {selectedService?.addOns?.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-sm font-medium text-foreground mb-2">Add-ons:</p>
              {selectedService.addOns.map((addOn) => (
                <div key={addOn.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{addOn.name}</span>
                  <span className="text-foreground">+₹{addOn.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* Schedule */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-foreground">
                {selectedSchedule?.date?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm mt-1">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-foreground">{selectedSchedule?.timeSlot?.time}</span>
            </div>
          </div>

          {/* Location */}
          <div className="border-t border-border pt-3">
            <div className="flex items-start space-x-2 text-sm">
              <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-foreground">
                  {locationDetails?.address}
                  {locationDetails?.apartment && `, ${locationDetails.apartment}`}
                </p>
                <p className="text-muted-foreground">
                  {locationDetails?.city}, {locationDetails?.state} {locationDetails?.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4">Price Breakdown</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service ({selectedService?.quantity || 1}x)</span>
            <span className="text-foreground">₹{pricing.basePrice.toFixed(2)}</span>
          </div>
          
          {pricing.optionPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Option</span>
              <span className="text-foreground">₹{pricing.optionPrice.toFixed(2)}</span>
            </div>
          )}
          
          {pricing.addOnPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Add-ons</span>
              <span className="text-foreground">₹{pricing.addOnPrice.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="text-foreground">₹{pricing.serviceFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="text-foreground">₹{pricing.tax.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-border pt-2 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">₹{pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedPaymentMethod === method.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <Icon name={method.icon} size={20} className="text-primary" />
              <span className="font-medium text-foreground">{method.name}</span>
            </label>
          ))}
        </div>

        {/* Saved Cards */}
        {selectedPaymentMethod === 'card' && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-foreground">Saved Cards</h4>
            
            {savedCards.map((card) => (
              <label
                key={card.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="savedCard"
                    value={card.id}
                    defaultChecked={card.isDefault}
                    onChange={() => setShowNewCardForm(false)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <Icon name={getCardIcon(card.type)} size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground">•••• •••• •••• {card.last4}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {card.expiryMonth}/{card.expiryYear}
                    </p>
                  </div>
                </div>
                {card.isDefault && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </label>
            ))}

            {/* Add New Card Option */}
            <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors duration-200">
              <input
                type="radio"
                name="savedCard"
                value="new"
                onChange={() => setShowNewCardForm(true)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <Icon name="Plus" size={20} className="text-primary" />
              <span className="font-medium text-foreground">Add New Card</span>
            </label>

            {/* New Card Form */}
            {showNewCardForm && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                <h5 className="font-medium text-foreground">Card Details</h5>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Card Number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardForm.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      error={errors.cardNumber}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Expiry Date"
                    type="text"
                    placeholder="MM/YY"
                    value={cardForm.expiryDate}
                    onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                    error={errors.expiryDate}
                    maxLength={5}
                    required
                  />
                  
                  <Input
                    label="CVV"
                    type="text"
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    error={errors.cvv}
                    maxLength={4}
                    required
                  />
                  
                  <div className="sm:col-span-2">
                    <Input
                      label="Cardholder Name"
                      type="text"
                      placeholder="John Doe"
                      value={cardForm.cardholderName}
                      onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                      error={errors.cardholderName}
                      required
                    />
                  </div>
                </div>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={cardForm.saveCard}
                    onChange={(e) => setCardForm(prev => ({ ...prev, saveCard: e.target.checked }))}
                    className="w-4 h-4 text-primary border-border focus:ring-primary rounded"
                  />
                  <span className="text-sm text-foreground">Save this card for future use</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Policy */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Cancellation Policy</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Free cancellation up to 24 hours before your appointment</p>
          <p>• Cancellations within 24 hours are subject to a 50% charge</p>
          <p>• No-shows will be charged the full amount</p>
          <p>• Rescheduling is free up to 2 hours before your appointment</p>
        </div>
        
        <label className="flex items-start space-x-3 mt-4">
          <input
            type="checkbox"
            checked={acceptedPolicies}
            onChange={(e) => setAcceptedPolicies(e.target.checked)}
            className="w-4 h-4 text-primary border-border focus:ring-primary rounded mt-0.5"
          />
          <span className="text-sm text-foreground">
            I understand and accept the cancellation policy and terms of service
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Details
        </Button>
        
        <Button
          onClick={handleBooking}
          disabled={!acceptedPolicies || isProcessing}
          loading={isProcessing}
          iconName="CreditCard"
          iconPosition="left"
          className="min-w-[160px]"
        >
          {isProcessing ? 'Processing...' : `Pay ₹${pricing.total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmationStep;