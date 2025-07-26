import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OverviewTab = ({ provider }) => {
  return (
    <div className="space-y-8">
      {/* Service Description */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">About {provider.name}</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {provider.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {provider.specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Pricing</h3>
        <div className="space-y-4">
          {provider.services.map((service, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{service.name}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{service.duration}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="font-semibold text-foreground">₹{service.price}</div>
                {service.originalPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    ₹{service.originalPrice}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Calendar */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Availability This Week</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {provider.weeklyAvailability.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {day.day}
              </div>
              <div className="text-xs text-foreground">{day.date}</div>
              <div className={`mt-2 p-2 rounded-lg text-xs ${
                day.available 
                  ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
              }`}>
                {day.available ? day.slots + ' slots' : 'Unavailable'}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full" iconName="Calendar" iconPosition="left">
          View Full Calendar
        </Button>
      </div>

      {/* Service Area Map */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Service Area</h3>
        <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Service Area Map"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${provider.location.lat},${provider.location.lng}&z=12&output=embed`}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Coverage Radius</p>
            <p className="text-sm text-muted-foreground">{provider.serviceRadius} miles from base location</p>
          </div>
          <Button variant="outline" iconName="MapPin" iconPosition="left">
            Check Coverage
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Phone" size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{provider.phone}</p>
              <p className="text-sm text-muted-foreground">Usually responds in {provider.responseTime}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Mail" size={16} className="text-secondary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{provider.email}</p>
              <p className="text-sm text-muted-foreground">For detailed inquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;