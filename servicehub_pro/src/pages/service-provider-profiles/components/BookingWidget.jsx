import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingWidget = ({ provider, isSticky = false }) => {
  const [selectedService, setSelectedService] = useState(provider.services[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const today = new Date();
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setShowTimeSlots(true);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    
    // Navigate to booking page with selected details
    console.log('Booking:', {
      provider: provider.id,
      service: selectedService.id,
      date: selectedDate,
      time: selectedTime
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDateAvailable = (date) => {
    // Mock availability logic
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0; // Not available on Sundays
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${isSticky ? 'sticky top-24' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Book Service</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred time</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              ₹{selectedService.price}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedService.duration}
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Service
          </label>
          <select
            value={selectedService.id}
            onChange={(e) => {
              const service = provider.services.find(s => s.id === e.target.value);
              setSelectedService(service);
            }}
            className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {provider.services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - ₹{service.price}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Date
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {availableDates.map((date, index) => {
              const available = isDateAvailable(date);
              const isSelected = selectedDate && 
                date.toDateString() === selectedDate.toDateString();
              
              return (
                <button
                  key={index}
                  onClick={() => available && handleDateSelect(date)}
                  disabled={!available}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : available
                      ? 'bg-muted text-foreground hover:bg-muted/80'
                      : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div className="text-xs opacity-80">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div>
                    {date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        {showTimeSlots && selectedDate && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Time
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {timeSlots.map((time, index) => {
                const isSelected = selectedTime === time;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="text-foreground">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-border">
                <span className="text-foreground">Total:</span>
                <span className="text-foreground">₹{selectedService.price}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="default"
            onClick={handleBookNow}
            disabled={!selectedDate || !selectedTime}
            className="w-full"
            iconName="Calendar"
            iconPosition="left"
          >
            Book Now
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            iconName="MessageCircle"
            iconPosition="left"
          >
            Message Provider
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={14} className="text-success" />
              <span>Insured</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={14} className="text-primary" />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} className="text-warning" />
              <span>On-time</span>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-destructive" />
            <div className="text-sm">
              <span className="font-medium text-foreground">Need emergency service?</span>
              <p className="text-muted-foreground">Call {provider.phone} for immediate assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;