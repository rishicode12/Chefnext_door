import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ServiceSelectionStep = ({ onNext, selectedService, setSelectedService }) => {
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [serviceQuantity, setServiceQuantity] = useState(1);

  const services = [
    {
      id: 1,
      name: "Deep House Cleaning",
      description: "Complete deep cleaning of your entire home including all rooms, bathrooms, and kitchen",
      price: 120,
      duration: "3-4 hours",
      image: "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400",
      popular: true,
      options: [
        { id: 1, name: "Standard Clean", price: 0 },
        { id: 2, name: "Premium Clean", price: 30 },
        { id: 3, name: "Eco-Friendly Products", price: 15 }
      ]
    },
    {
      id: 2,
      name: "Regular House Cleaning",
      description: "Weekly or bi-weekly cleaning service to maintain your home\'s cleanliness",
      price: 80,
      duration: "2-3 hours",
      image: "https://images.pexels.com/photos/4107123/pexels-photo-4107123.jpeg?auto=compress&cs=tinysrgb&w=400",
      options: [
        { id: 1, name: "Basic Clean", price: 0 },
        { id: 2, name: "Extended Clean", price: 20 }
      ]
    },
    {
      id: 3,
      name: "Move-in/Move-out Cleaning",
      description: "Thorough cleaning for moving situations, ensuring your space is spotless",
      price: 200,
      duration: "4-6 hours",
      image: "https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400",
      options: [
        { id: 1, name: "Standard Move Clean", price: 0 },
        { id: 2, name: "Deep Move Clean", price: 50 }
      ]
    }
  ];

  const addOns = [
    { id: 1, name: "Inside Oven Cleaning", price: 25, description: "Deep clean inside your oven" },
    { id: 2, name: "Inside Refrigerator", price: 20, description: "Clean inside of refrigerator" },
    { id: 3, name: "Window Cleaning (Interior)", price: 30, description: "Clean all interior windows" },
    { id: 4, name: "Garage Cleaning", price: 40, description: "Clean and organize garage space" },
    { id: 5, name: "Basement Cleaning", price: 35, description: "Clean basement area" }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService({
      ...service,
      selectedOption: service.options[0],
      quantity: serviceQuantity,
      addOns: selectedAddOns
    });
  };

  const handleAddOnToggle = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleOptionChange = (option) => {
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        selectedOption: option
      });
    }
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    const basePrice = selectedService.price * serviceQuantity;
    const optionPrice = selectedService.selectedOption?.price || 0;
    const addOnPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return basePrice + optionPrice + addOnPrice;
  };

  const handleNext = () => {
    if (selectedService) {
      onNext({
        ...selectedService,
        quantity: serviceQuantity,
        addOns: selectedAddOns,
        total: calculateTotal()
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Selection */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Choose Your Service</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedService?.id === service.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              {service.popular && (
                <div className="absolute -top-2 left-4 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                  Popular
                </div>
              )}
              
              <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                <Image
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-primary">₹{service.price}</span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Icon name="Clock" size={14} className="mr-1" />
                  {service.duration}
                </span>
              </div>
              
              {selectedService?.id === service.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Icon name="Check" size={16} className="text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Service Options */}
      {selectedService && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3">Service Options</h3>
          <div className="space-y-2">
            {selectedService.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-background transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="serviceOption"
                    checked={selectedService.selectedOption?.id === option.id}
                    onChange={() => handleOptionChange(option)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="font-medium text-foreground">{option.name}</span>
                </div>
                <span className="text-primary font-semibold">
                  {option.price > 0 ? `+₹${option.price}` : 'Included'}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {selectedService && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setServiceQuantity(Math.max(1, serviceQuantity - 1))}
              disabled={serviceQuantity <= 1}
              className="w-10 h-10 p-0"
            >
              <Icon name="Minus" size={16} />
            </Button>
            <span className="text-lg font-semibold text-foreground min-w-[2rem] text-center">
              {serviceQuantity}
            </span>
            <Button
              variant="outline"
              onClick={() => setServiceQuantity(serviceQuantity + 1)}
              className="w-10 h-10 p-0"
            >
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Add-ons */}
      {selectedService && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">Add-on Services</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {addOns.map((addOn) => (
              <label
                key={addOn.id}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.some(item => item.id === addOn.id)}
                  onChange={() => handleAddOnToggle(addOn)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{addOn.name}</span>
                    <span className="text-primary font-semibold">+₹{addOn.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{addOn.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Total and Continue */}
      {selectedService && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">₹{calculateTotal()}</span>
          </div>
          <Button
            onClick={handleNext}
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue to Schedule
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionStep;