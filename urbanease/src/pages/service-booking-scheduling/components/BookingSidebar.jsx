import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BookingSidebar = ({ 
  selectedService, 
  selectedSchedule, 
  locationDetails, 
  currentStep 
}) => {
  const calculateTotal = () => {
    if (!selectedService) return 0;
    
    const basePrice = selectedService.price * (selectedService.quantity || 1);
    const optionPrice = selectedService.selectedOption?.price || 0;
    const addOnPrice = selectedService.addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
    const subtotal = basePrice + optionPrice + addOnPrice;
    const tax = subtotal * 0.08;
    const serviceFee = 5.99;
    
    return {
      subtotal,
      tax,
      serviceFee,
      total: subtotal + tax + serviceFee
    };
  };

  const pricing = calculateTotal();

  return (
    <div className="bg-card border border-border rounded-lg p-4 sticky top-20">
      <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
      
      {/* Service Details */}
      {selectedService && (
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <Image
                src={selectedService.image}
                alt={selectedService.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm truncate">
                {selectedService.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {selectedService.selectedOption?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty: {selectedService.quantity || 1}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground text-sm">
                ₹{selectedService.price}
              </p>
            </div>
          </div>

          {/* Add-ons */}
          {selectedService.addOns?.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs font-medium text-foreground mb-2">Add-ons:</p>
              {selectedService.addOns.map((addOn) => (
                <div key={addOn.id} className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground truncate mr-2">
                    {addOn.name}
                  </span>
                  <span className="text-foreground">+₹{addOn.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule */}
      {selectedSchedule?.date && currentStep >= 2 && (
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Schedule</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedSchedule.date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          {selectedSchedule.timeSlot && (
            <p className="text-sm text-muted-foreground">
              {selectedSchedule.timeSlot.time}
            </p>
          )}
        </div>
      )}

      {/* Location */}
      {locationDetails?.address && currentStep >= 3 && (
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Location</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {locationDetails.address}
            {locationDetails.apartment && `, ${locationDetails.apartment}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {locationDetails.city}, {locationDetails.state} {locationDetails.zipCode}
          </p>
        </div>
      )}

      {/* Pricing */}
      {selectedService && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₹{pricing.subtotal.toFixed(2)}</span>
          </div>
          
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
              <span className="text-lg font-bold text-primary">
                ₹{pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="HelpCircle" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Need Help?</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Our support team is available 24/7 to assist you with your booking.
        </p>
        <div className="space-y-2">
          <a
            href="tel:+91-800-SERVICE"
            className="flex items-center space-x-2 text-xs text-primary hover:underline"
          >
            <Icon name="Phone" size={12} />
            <span>(800) SERVICE</span>
          </a>
          <a
            href="mailto:support@urbanease.com"
            className="flex items-center space-x-2 text-xs text-primary hover:underline"
          >
            <Icon name="Mail" size={12} />
            <span>support@urbanease.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;