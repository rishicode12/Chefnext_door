import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ServiceCarousel = ({ title, services, onServiceSelect }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 280;
    const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }, 300);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-2 h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-2 h-8 w-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="flex-shrink-0 w-64 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onServiceSelect(service)}
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              {service.isEmergency && (
                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
                  24/7
                </div>
              )}
              {service.isVerified && (
                <div className="absolute top-2 right-2 bg-success text-success-foreground p-1 rounded-full">
                  <Icon name="CheckCircle" size={14} />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-1 truncate">{service.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 truncate">{service.category}</p>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm font-medium text-foreground">{service.rating}</span>
                  <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{service.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-foreground">₹{service.startingPrice}</span>
                  <span className="text-sm text-muted-foreground ml-1">starting</span>
                </div>
                <Button variant="default" className="text-sm px-4 py-2">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCarousel;