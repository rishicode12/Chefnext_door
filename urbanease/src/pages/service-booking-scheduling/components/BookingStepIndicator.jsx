import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingStepIndicator = ({ currentStep, totalSteps = 4 }) => {
  const steps = [
    { id: 1, title: 'Service', description: 'Choose service' },
    { id: 2, title: 'Schedule', description: 'Pick date & time' },
    { id: 3, title: 'Details', description: 'Location & info' },
    { id: 4, title: 'Payment', description: 'Complete booking' },
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Mobile Progress Bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {steps.find(step => step.id === currentStep)?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {steps.find(step => step.id === currentStep)?.description}
            </p>
          </div>
        </div>

        {/* Desktop Horizontal Steps */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isLast = index === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center">
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
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        status === 'current' ? 'text-primary' : 
                        status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {!isLast && (
                    <div className="flex-1 mx-4">
                      <div className={`h-0.5 transition-all duration-300 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-border'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStepIndicator;