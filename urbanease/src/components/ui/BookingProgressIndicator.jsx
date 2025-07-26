import React from 'react';
import Icon from '../AppIcon';

const BookingProgressIndicator = ({ currentStep = 1, totalSteps = 4, steps = [] }) => {
  const defaultSteps = [
    { id: 1, title: 'Service Selection', description: 'Choose your service' },
    { id: 2, title: 'Provider Selection', description: 'Select a provider' },
    { id: 3, title: 'Schedule & Details', description: 'Set time and details' },
    { id: 4, title: 'Payment & Confirmation', description: 'Complete booking' },
  ];

  const bookingSteps = steps.length > 0 ? steps : defaultSteps;

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepId, status) => {
    if (status === 'completed') return 'Check';
    if (status === 'current') return 'Circle';
    return 'Circle';
  };

  return (
    <div className="w-full bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-foreground">
              {bookingSteps.find(step => step.id === currentStep)?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {bookingSteps.find(step => step.id === currentStep)?.description}
            </p>
          </div>
        </div>

        {/* Desktop Horizontal Steps */}
        <div className="hidden lg:block">
          <nav aria-label="Booking progress">
            <ol className="flex items-center justify-between">
              {bookingSteps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isLast = index === bookingSteps.length - 1;

                return (
                  <li key={step.id} className="flex items-center flex-1">
                    <div className="flex items-center">
                      {/* Step Circle */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          status === 'completed'
                            ? 'bg-primary border-primary text-primary-foreground'
                            : status === 'current' ?'bg-primary border-primary text-primary-foreground' :'bg-background border-border text-muted-foreground'
                        }`}
                      >
                        {status === 'completed' ? (
                          <Icon name="Check" size={16} />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="ml-4 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            status === 'current' ?'text-primary'
                              : status === 'completed' ?'text-foreground' :'text-muted-foreground'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {!isLast && (
                      <div className="flex-1 mx-6">
                        <div
                          className={`h-0.5 transition-all duration-300 ${
                            step.id < currentStep ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;