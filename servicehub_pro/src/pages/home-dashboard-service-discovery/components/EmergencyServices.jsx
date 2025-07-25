import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HomeServices = ({ onHomeServiceCall }) => {
  const homeServices = [
    {
      id: 'plumbing service',
      name: 'Plumbing Service',
      icon: 'Wrench',
      description: 'Burst pipes, leaks, blockages',
      responseTime: '25-40 min',
      phone: '+1-800-PLUMBER',
      available: true
    },
    {
      id: 'electrical service',
      name: 'Electrical Service',
      icon: 'Zap',
      description: 'Power outages, electrical faults',
      responseTime: '30-45 min',
      phone: '+1-800-ELECTRIC',
      available: true
    },
    {
      id: 'pest contol service',
      name: 'Pest Contol Service',
      icon: 'Key',
      description: 'Lockouts, broken locks',
      responseTime: '30-45 min',
      phone: '+1-800-LOCKOUT',
      available: true
    },
    {
      id: 'ac repair service',
      name: 'AC Repair Service',
      icon: 'Wind',
      description: 'AC/Heating failures',
      responseTime: '30-45 min',
      phone: '+1-800-HVAC911',
      available: true
    }
  ];

  return (
    <div className="mb-8">
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Home Services</h2>
            <p className="text-sm text-muted-foreground">Available 24/7 for urgent situations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {homeServices.map((service) => (
            <div
              key={service.id}
              className={`bg-card border rounded-lg p-4 ${
                service.available 
                  ? 'border-border hover:border-destructive/50 hover:shadow-md' 
                  : 'border-border opacity-60'
              } transition-all duration-200`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  service.available 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={service.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">
                    {service.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      service.available ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                    }`}></div>
                    <span className="text-xs text-muted-foreground">
                      {service.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{service.responseTime}</span>
                </div>
              </div>

              <Button
                variant={service.available ? "destructive" : "outline"}
                disabled={!service.available}
                onClick={() => onHomeServiceCall(service)}
                className="w-full text-xs py-2"
              >
                {service.available ? (
                  <>
                    <Icon name="Phone" size={12} className="mr-1" />
                    Call Now
                  </>
                ) : (
                  'Currently Unavailable'
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Home Service Notice</p>
              <p className="text-muted-foreground">
                Home services may have additional charges. Response times may vary based on location and availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeServices;