import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Delhi, IN');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const dropdownRef = useRef(null);

  const popularLocations = [
    { city: 'Delhi', state: 'New Delhi', country: 'INDIA' },
    { city: 'Lucknow', state: 'Uttar Pradesh', country: 'INDIA' },
    { city: 'Chennai', state: 'Tamil Nadu', country: 'INDIA' },
    { city: 'Bhopal', state: 'Madhya Pradesh', country: 'INDIA' },
    { city: 'Bengaluru', state: 'Karnataka', country: 'INDIA' },
    { city: 'Mumbai', state: 'Maharashtra', country: 'INDIA' },
  ];

  const filteredLocations = popularLocations.filter(location =>
    `${location.city}, ${location.state}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(`${location.city}, ${location.state}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate reverse geocoding
          setTimeout(() => {
            setSelectedLocation('Current Location');
            setIsDetecting(false);
            setIsOpen(false);
          }, 1500);
        },
        (error) => {
          console.error('Error detecting location:', error);
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium hover:bg-muted transition-colors duration-200"
      >
        <Icon name="MapPin" size={16} className="text-primary" />
        <span className="hidden sm:inline max-w-32 truncate">{selectedLocation}</span>
        <Icon name="ChevronDown" size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-300 lg:left-auto lg:right-0">
          <div className="p-4">
            <h3 className="font-semibold text-popover-foreground mb-3">Select Location</h3>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            {/* Detect Current Location */}
            <Button
              variant="outline"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full justify-start space-x-2 mb-4"
            >
              <Icon name={isDetecting ? "Loader2" : "Crosshair"} size={16} className={isDetecting ? "animate-spin" : ""} />
              <span>{isDetecting ? 'Detecting...' : 'Use Current Location'}</span>
            </Button>

            {/* Location List */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Popular Cities
              </h4>
              {filteredLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-popover-foreground">
                      {location.city}, {location.state}
                    </div>
                    <div className="text-xs text-muted-foreground">{location.country}</div>
                  </div>
                  <Icon name="ArrowRight" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              ))}
              
              {filteredLocations.length === 0 && searchQuery && (
                <div className="px-3 py-4 text-center text-muted-foreground">
                  <Icon name="MapPin" size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No locations found</p>
                  <p className="text-xs">Try searching for a different city</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;