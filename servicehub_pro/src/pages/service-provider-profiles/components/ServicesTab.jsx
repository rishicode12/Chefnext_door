import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServicesTab = ({ provider }) => {
  const [selectedService, setSelectedService] = useState(null);

  const serviceCategories = [
    {
      id: 'primary',
      title: 'Primary Services',
      description: 'Main services offered by this provider',
      services: provider.services.filter(s => s.isPrimary)
    },
    {
      id: 'additional',
      title: 'Additional Services',
      description: 'Extra services available upon request',
      services: provider.services.filter(s => !s.isPrimary)
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(selectedService?.id === service.id ? null : service);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-8">
      {serviceCategories.map((category) => (
        <div key={category.id} className="bg-card border border-border rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {category.title}
            </h3>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="space-y-4">
            {category.services.map((service) => (
              <div key={service.id} className="border border-border rounded-lg overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          service.color || 'bg-primary/10'
                        }`}>
                          <Icon 
                            name={service.icon} 
                            size={20} 
                            className={service.iconColor || 'text-primary'} 
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} />
                          <span>{formatDuration(service.durationMinutes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={14} />
                          <span>{service.location}</span>
                        </div>
                        {service.isPopular && (
                          <div className="flex items-center space-x-1 text-accent">
                            <Icon name="Star" size={14} />
                            <span>Popular</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="font-semibold text-foreground text-lg">
                        ₹{service.price}
                      </div>
                      {service.originalPrice && service.originalPrice > service.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹{service.originalPrice}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName={selectedService?.id === service.id ? "ChevronUp" : "ChevronDown"}
                          iconPosition="right"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Service Details */}
                {selectedService?.id === service.id && (
                  <div className="border-t border-border bg-muted/30 p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-foreground mb-3">Service Details</h5>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {service.fullDescription}
                        </p>

                        {service.includes && service.includes.length > 0 && (
                          <div className="mb-4">
                            <h6 className="font-medium text-foreground mb-2">What's Included:</h6>
                            <ul className="space-y-1">
                              {service.includes.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Icon name="Check" size={14} className="text-success" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {service.requirements && service.requirements.length > 0 && (
                          <div>
                            <h6 className="font-medium text-foreground mb-2">Requirements:</h6>
                            <ul className="space-y-1">
                              {service.requirements.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Icon name="AlertCircle" size={14} className="text-warning" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-medium text-foreground mb-3">Pricing & Availability</h5>
                        
                        {service.pricingTiers && service.pricingTiers.length > 0 && (
                          <div className="mb-4">
                            <h6 className="text-sm font-medium text-foreground mb-2">Pricing Options:</h6>
                            <div className="space-y-2">
                              {service.pricingTiers.map((tier, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                                  <div>
                                    <div className="font-medium text-foreground">{tier.name}</div>
                                    <div className="text-sm text-muted-foreground">{tier.description}</div>
                                  </div>
                                  <div className="font-semibold text-foreground">₹{tier.price}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Next Available:</span>
                            <span className="font-medium text-foreground">{service.nextAvailable}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Booking Notice:</span>
                            <span className="font-medium text-foreground">{service.bookingNotice}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Cancellation:</span>
                            <span className="font-medium text-foreground">{service.cancellationPolicy}</span>
                          </div>
                        </div>

                        <div className="mt-6 space-y-2">
                          <Button 
                            variant="default" 
                            className="w-full"
                            iconName="Calendar"
                            iconPosition="left"
                          >
                            Book This Service
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            iconName="MessageCircle"
                            iconPosition="left"
                          >
                            Ask Questions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Service Packages */}
      {provider.servicePackages && provider.servicePackages.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Service Packages</h3>
          <p className="text-muted-foreground mb-6">
            Save money with our bundled service packages
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {provider.servicePackages.map((package_, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{package_.name}</h4>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">₹{package_.price}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{package_.originalPrice}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{package_.description}</p>
                
                <div className="space-y-1 mb-4">
                  {package_.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex items-center space-x-2 text-sm">
                      <Icon name="Check" size={14} className="text-success" />
                      <span className="text-muted-foreground">{service}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent font-medium">
                    Save ₹{package_.originalPrice - package_.price}
                  </span>
                  <Button variant="outline" size="sm">
                    Select Package
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;