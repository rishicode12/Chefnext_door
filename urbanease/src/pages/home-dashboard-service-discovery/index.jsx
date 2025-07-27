import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ServiceCarousel from './components/ServiceCarousel';
import SearchBar from './components/SearchBar';
import QuickAccessTiles from './components/QuickAccessTiles';
import PromotionsBanner from './components/PromotionsBanner';
import RecentBookings from './components/RecentBookings';
import EmergencyServices from './components/EmergencyServices';

const HomeDashboardServiceDiscovery = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for services
  const emergencyServices = [
    {
      id: 1,
      name: "Plumbing Service",
      category: "Plumbing",
      image: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?_gl=1*ux7taf*_ga*MTE5Njg5MjQxMC4xNzUzNjIzNDA5*_ga_8JE65Q40S6*czE3NTM2MjU5NTgkbzIkZzEkdDE3NTM2MjY0MzEkajQ0JGwwJGgw",
      rating: 4.9,
      reviewCount: 234,
      distance: "0.5 mi",
      startingPrice: 89,
      isEmergency: true,
      isVerified: true
    },
    {
      id: 2,
      name: "Electric Service",
      category: "Electrical",
      image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
      rating: 4.8,
      reviewCount: 189,
      distance: "0.8 mi",
      startingPrice: 75,
      isEmergency: true,
      isVerified: true
    },
    {
      id: 3,
      name: "Kitchen Service",
      category: "Appliance Repair",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 156,
      distance: "1.2 mi",
      startingPrice: 65,
      isEmergency: true,
      isVerified: true
    }
  ];

  const beautyWellnessServices = [
    {
      id: 4,
      name: "Glamour Beauty Salon",
      category: "Beauty & Wellness",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      rating: 4.9,
      reviewCount: 312,
      distance: "0.3 mi",
      startingPrice: 45,
      isVerified: true
    },
    {
      id: 5,
      name: "Facial and Cleanup",
      category: "Beauty & Wellness",
      image: "https://images.pexels.com/photos/5069493/pexels-photo-5069493.jpeg?w=400&h=300&fit=crop",
      rating: 4.8,
      reviewCount: 278,
      distance: "0.7 mi",
      startingPrice: 80,
      isVerified: true
    },
    {
      id: 6,
      name: "Nail Care",
      category: "Beauty",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
      rating: 4.6,
      reviewCount: 145,
      distance: "1.1 mi",
      startingPrice: 35,
      isVerified: false
    }
  ];

  const homeMaintenanceServices = [
    {
      id: 7,
      name: "Home Cleaning Services",
      category: "House Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      rating: 4.9,
      reviewCount: 456,
      distance: "0.4 mi",
      startingPrice: 120,
      isVerified: true
    },
    {
      id: 8,
      name: "Home Painting Services",
      category: "Painting Service",
      image: "https://images.pexels.com/photos/5583111/pexels-photo-5583111.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      rating: 4.7,
      reviewCount: 203,
      distance: "0.9 mi",
      startingPrice: 85,
      isVerified: true
    },
    {
      id: 9,
      name: "Garden Care Services",
      category: "Gardening",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      rating: 4.5,
      reviewCount: 167,
      distance: "1.5 mi",
      startingPrice: 95,
      isVerified: false
    }
  ];

  const recentBookings = [
    {
      id: 1,
      serviceName: "Home Cleaning Services",
      providerName: "Home Cleaning Services",
      providerImage: "https://images.pexels.com/photos/4239039/pexels-photo-4239039.jpeg?_gl=1*1l8rnt7*_ga*MTE5Njg5MjQxMC4xNzUzNjIzNDA5*_ga_8JE65Q40S6*czE3NTM2MjU5NTgkbzIkZzEkdDE3NTM2MjYxNjIkajQ4JGwwJGgw",
      date: "Jul 23, 2025",
      time: "2:00 PM",
      amount: 150,
      status: "Completed",
      rated: false
    },
    {
      id: 2,
      serviceName: "Electrical Repair",
      providerName: "Quick Fix Electrical",
      providerImage: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
      date: "Jul 25, 2025",
      time: "10:00 AM",
      amount: 125,
      status: "Upcoming",
      rated: false
    },
    {
      id: 3,
      serviceName: "Plumbing Maintenance",
      providerName: "24/7 Emergency Plumbing",
      providerImage: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?_gl=1*ux7taf*_ga*MTE5Njg5MjQxMC4xNzUzNjIzNDA5*_ga_8JE65Q40S6*czE3NTM2MjU5NTgkbzIkZzEkdDE3NTM2MjY0MzEkajQ0JGwwJGgw",
      date: "Jul 20, 2025",
      time: "3:30 PM",
      amount: 89,
      status: "Completed",
      rated: true
    }
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    navigate('/service-provider-profiles', { state: { searchQuery: query } });
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleServiceSelect = (service) => {
    navigate('/service-booking-scheduling', { state: { selectedService: service } });
  };

  const handleCategorySelect = (category) => {
    navigate('/service-provider-profiles', { state: { selectedCategory: category } });
  };

  const handleRebook = (booking) => {
    navigate('/service-booking-scheduling', { state: { rebookingData: booking } });
  };

  const handleRate = (booking) => {
    console.log('Rating booking:', booking);
    // Open rating modal or navigate to rating page
  };

  const handleContact = (booking) => {
    console.log('Contacting provider for booking:', booking);
    // Open contact modal or navigate to chat
  };

  const handleEmergencyCall = (service) => {
    console.log('Emergency call for:', service);
    // Handle emergency service call
    if (service.available) {
      window.location.href = `tel:${service.phone}`;
    }
  };

  const handlePullToRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    // Simulate loading user location and preferences
    console.log('Loading user dashboard data...');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="fixed top-16 left-0 right-0 bg-primary text-primary-foreground text-center py-2 z-50">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="RotateCw" size={16} className="animate-spin" />
            <span className="text-sm">Refreshing...</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 pt-20">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Home services at your doorstep
          </h1>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onFilterToggle={handleFilterToggle} />

        {/* Promotions Banner */}
        <PromotionsBanner />

        {/* Quick Access Tiles */}
        <QuickAccessTiles onCategorySelect={handleCategorySelect} />

        {/* Emergency Services */}
        <EmergencyServices onEmergencyCall={handleEmergencyCall} />

        {/* Service Carousels - Emergency Services in one row, others in separate rows */}
        <div className="space-y-8 mb-8">
          {/* Emergency Services - 3 cards in one row */}
          <div className="w-full">
            <h2 className="text-base font-semibold text-foreground mb-4">Emergency Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
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

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-base mb-1 truncate">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{service.category}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-0.5">
                        <Icon name="Star" size={14} className="text-warning fill-current" />
                        <span className="text-sm font-medium text-foreground">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                      </div>
                      <span className="text-muted-foreground text-sm">•</span>
                      <div className="flex items-center space-x-0.5">
                        <Icon name="MapPin" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.distance}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-semibold text-foreground">₹{service.startingPrice}</span>
                        <span className="text-sm text-muted-foreground ml-1">starting</span>
                      </div>
                      <Button variant="default" className="text-sm px-3 py-1 h-8">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Beauty & Wellness - 3 cards in one row */}
          <div className="w-full">
            <h2 className="text-base font-semibold text-foreground mb-4">Beauty & Wellness</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {beautyWellnessServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
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

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-base mb-1 truncate">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{service.category}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-0.5">
                        <Icon name="Star" size={14} className="text-warning fill-current" />
                        <span className="text-sm font-medium text-foreground">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                      </div>
                      <span className="text-muted-foreground text-sm">•</span>
                      <div className="flex items-center space-x-0.5">
                        <Icon name="MapPin" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.distance}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-semibold text-foreground">₹{service.startingPrice}</span>
                        <span className="text-sm text-muted-foreground ml-1">starting</span>
                      </div>
                      <Button variant="default" className="text-sm px-3 py-1 h-8">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Home Maintenance - 3 cards in one row */}
          <div className="w-full">
            <h2 className="text-base font-semibold text-foreground mb-4">Home Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {homeMaintenanceServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
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

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-base mb-1 truncate">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{service.category}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-0.5">
                        <Icon name="Star" size={14} className="text-warning fill-current" />
                        <span className="text-sm font-medium text-foreground">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                      </div>
                      <span className="text-muted-foreground text-sm">•</span>
                      <div className="flex items-center space-x-0.5">
                        <Icon name="MapPin" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.distance}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-semibold text-foreground">₹{service.startingPrice}</span>
                        <span className="text-sm text-muted-foreground ml-1">starting</span>
                      </div>
                      <Button variant="default" className="text-sm px-3 py-1 h-8">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <RecentBookings
          bookings={recentBookings}
          onRebook={handleRebook}
          onRate={handleRate}
          onContact={handleContact}
        />

        {/* Bottom Spacing for Mobile Navigation */}
        <div className="h-20 lg:h-0"></div>
        
        {/* Footer */}
        <footer className="border-t border-border mt-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">UrbanEase</h3>
                <p className="text-sm text-muted-foreground mb-4">Your one-stop solution for all home services. Quality service providers at your fingertips.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="Facebook" size={20} />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="Twitter" size={20} />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="Instagram" size={20} />
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Services</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Become a Provider</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                </ul>
              </div>
              
              {/* Support */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQs</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Safety Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Community Guidelines</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start space-x-3">
                    <Icon name="MapPin" size={18} className="text-primary mt-0.5" />
                    <span className="text-muted-foreground">123 Service Street, Delhi, 110001</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icon name="Phone" size={18} className="text-primary" />
                    <span className="text-muted-foreground">+91 98765 43210</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icon name="Mail" size={18} className="text-primary" />
                    <span className="text-muted-foreground">support@urbanease.com</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom Footer */}
            <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">&copy; {new Date().getFullYear()} UrbanEase. All rights reserved.</p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Filter Sidebar (Mobile) */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              <Button
                variant="ghost"
                onClick={() => setIsFilterOpen(false)}
                className="p-2"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Service Type</h4>
                <div className="space-y-2">
                  {['All Services', 'Emergency', 'Beauty', 'Cleaning', 'Repair'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm text-foreground">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Distance</h4>
                <div className="space-y-2">
                  {['Within 1 mile', 'Within 3 miles', 'Within 5 miles', 'Within 10 miles'].map((distance) => (
                    <label key={distance} className="flex items-center space-x-2">
                      <input type="radio" name="distance" className="border-border" />
                      <span className="text-sm text-foreground">{distance}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹0</span>
                    <span>₹500+</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-border" />
                      <div className="flex items-center space-x-1">
                        {[...Array(rating)].map((_, i) => (
                          <Icon key={i} name="Star" size={14} className="text-warning fill-current" />
                        ))}
                        <span className="text-sm text-foreground">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button variant="default" className="w-full">
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full">
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboardServiceDiscovery;