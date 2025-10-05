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
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis pr-2">{title}</h2>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-1 h-6 w-6"
          >
            <Icon name="ChevronLeft" size={12} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-1 h-6 w-6"
          >
            <Icon name="ChevronRight" size={12} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 h-[calc(100%-35px)]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="flex-shrink-0 w-[calc(100%-10px)] min-w-[220px] max-w-[280px] bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onServiceSelect(service)}
          >
            <div className="relative h-36 overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              {service.isEmergency && (
                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                  24/7
                </div>
              )}
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{service.name}</h3>
              <p className="text-xs text-muted-foreground mb-1.5 truncate">{service.category}</p>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-0.5">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-xs font-medium text-foreground">{service.rating}</span>
                  <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
                </div>
                <span className="text-muted-foreground text-xs">•</span>
                <div className="flex items-center space-x-0.5">
                  <Icon name="MapPin" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{service.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground">₹{service.startingPrice}</span>
                  <span className="text-xs text-muted-foreground ml-0.5">starting</span>
                </div>
                <Button variant="default" className="text-xs px-2.5 py-1 h-7">
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