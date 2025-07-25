import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PromotionsBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promotions = [
    {
      id: 1,
      title: "First Time User Special",
      subtitle: "Get 20% off your first booking",
      description: "Valid for all services. Use code: WELCOME20",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      buttonText: "Claim Offer",
      backgroundColor: "bg-gradient-to-r from-primary to-secondary",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Summer Cleaning Special",
      subtitle: "Deep cleaning services at 30% off",
      description: "Professional home cleaning with eco-friendly products",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop",
      buttonText: "Book Now",
      backgroundColor: "bg-gradient-to-r from-success to-accent",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Appliance Service and Repair",
      subtitle: "24/7 appliance service support",
      description: "Quick response time guaranteed within 30 minutes",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop",
      buttonText: "Call Now",
      backgroundColor: "bg-gradient-to-r from-destructive to-warning",
      textColor: "text-white"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [promotions.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  return (
    <div className="relative mb-8 rounded-lg overflow-hidden">
      <div className="relative h-48 sm:h-56 lg:h-64">
        {promotions.map((promo, index) => (
          <div
            key={promo.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`${promo.backgroundColor} h-full relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="relative z-10 h-full flex items-center p-6 lg:p-8">
                <div className="max-w-md">
                  <h3 className={`text-2xl lg:text-3xl font-bold ${promo.textColor} mb-2`}>
                    {promo.title}
                  </h3>
                  <p className={`text-lg ${promo.textColor} mb-2 opacity-90`}>
                    {promo.subtitle}
                  </p>
                  <p className={`text-sm ${promo.textColor} mb-4 opacity-80`}>
                    {promo.description}
                  </p>
                  <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
                    {promo.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
      >
        <Icon name="ChevronLeft" size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
      >
        <Icon name="ChevronRight" size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionsBanner;