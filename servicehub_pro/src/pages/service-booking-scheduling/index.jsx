import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BookingStepIndicator from './components/BookingStepIndicator';
import ServiceSelectionStep from './components/ServiceSelectionStep';
import ScheduleSelectionStep from './components/ScheduleSelectionStep';
import LocationDetailsStep from './components/LocationDetailsStep';
import PaymentConfirmationStep from './components/PaymentConfirmationStep';
import BookingConfirmation from './components/BookingConfirmation';
import BookingSidebar from './components/BookingSidebar';

const ServiceBookingScheduling = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleStepNext = (stepData) => {
    switch (currentStep) {
      case 1:
        setSelectedService(stepData);
        setCurrentStep(2);
        break;
      case 2:
        setSelectedSchedule(stepData);
        setCurrentStep(3);
        break;
      case 3:
        setLocationDetails(stepData);
        setCurrentStep(4);
        break;
      case 4:
        // Payment step handled by PaymentConfirmationStep
        break;
      default:
        break;
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingComplete = (completedBookingData) => {
    setBookingData(completedBookingData);
    setBookingComplete(true);
  };

  const renderCurrentStep = () => {
    if (bookingComplete) {
      return <BookingConfirmation bookingData={bookingData} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <ServiceSelectionStep
            onNext={handleStepNext}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        );
      case 2:
        return (
          <ScheduleSelectionStep
            onNext={handleStepNext}
            onBack={handleStepBack}
            selectedSchedule={selectedSchedule}
            setSelectedSchedule={setSelectedSchedule}
          />
        );
      case 3:
        return (
          <LocationDetailsStep
            onNext={handleStepNext}
            onBack={handleStepBack}
            locationDetails={locationDetails}
            setLocationDetails={setLocationDetails}
          />
        );
      case 4:
        return (
          <PaymentConfirmationStep
            onNext={handleStepNext}
            onBack={handleStepBack}
            selectedService={selectedService}
            selectedSchedule={selectedSchedule}
            locationDetails={locationDetails}
            onBookingComplete={handleBookingComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Progress Indicator */}
      {!bookingComplete && (
        <BookingStepIndicator currentStep={currentStep} />
      )}

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-background">
                {renderCurrentStep()}
              </div>
            </div>

            {/* Sidebar - Hidden on mobile during booking flow, shown on desktop */}
            {!bookingComplete && (
              <div className="hidden lg:block">
                <BookingSidebar
                  selectedService={selectedService}
                  selectedSchedule={selectedSchedule}
                  locationDetails={locationDetails}
                  currentStep={currentStep}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar - Only show during booking flow */}
      {!bookingComplete && selectedService && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedService.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Step {currentStep} of 4
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                ₹{(() => {
                  const basePrice = selectedService.price * (selectedService.quantity || 1);
                  const optionPrice = selectedService.selectedOption?.price || 0;
                  const addOnPrice = selectedService.addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
                  const subtotal = basePrice + optionPrice + addOnPrice;
                  const tax = subtotal * 0.08;
                  const serviceFee = 5.99;
                  return (subtotal + tax + serviceFee).toFixed(2);
                })()}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Add bottom padding to prevent content from being hidden behind mobile bottom bar */}
      {!bookingComplete && selectedService && (
        <div className="lg:hidden h-20"></div>
      )}
    </div>
  );
};

export default ServiceBookingScheduling;