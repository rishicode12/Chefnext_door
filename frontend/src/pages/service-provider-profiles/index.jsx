import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProviderHero from './components/ProviderHero';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import ReviewsTab from './components/ReviewsTab';
import GalleryTab from './components/GalleryTab';
import ServicesTab from './components/ServicesTab';
import BookingWidget from './components/BookingWidget';

const ServiceProviderProfiles = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock provider data
  const provider = {
    id: "provider-001",
    name: "Mohan Singh",
    serviceCategory: "Professional Chef",
    profileImage: "/assets/images/dishes/chef.jpeg",
    rating: 4.8,
    reviewCount: 247,
    isVerified: true,
    experience: 8,
    completedJobs: 1250,
    responseTime: "less than 2 hours",
    phone: "912354567",
    email: "yummyfoods@urbanease.com",
    location: {
      lat: 40.7128,
      lng: -74.0060
    },
    serviceRadius: 15,
    description: `Professional chef with over 8 years of experience serving the Delhi metropolitan area. Specializing in Indian cuisine, home cooking, and meal preparation.\n\nI take pride in delivering delicious, home-cooked meals using fresh ingredients and traditional recipes. All dishes are prepared with care and attention to detail. Available for home cooking services and meal prep 7 days a week.`,
    specialties: ["Home Cooking", "Meal Preparation", "Indian Cuisine", "Special Occasion Meals", "Diet-Specific Cooking"],
    badges: [
      { icon: "Shield", label: "Background Checked" },
      { icon: "Award", label: "Certified Chef" },
      { icon: "CheckCircle", label: "Verified Pro" }
    ],
    services: [
      {
        id: "service-001",
        name: "Home Cooking Service",
        description: "Delicious home-cooked meals prepared in your kitchen",
        shortDescription: "Fresh meals prepared in your home",
        fullDescription: `Professional home cooking service where I prepare delicious, home-cooked meals in your kitchen using fresh ingredients.\n\nThis service includes menu planning, grocery shopping (if needed), meal preparation, and kitchen cleanup. All dishes are made with fresh ingredients and traditional recipes. Available 7 days a week.`,
        price: 150,
        originalPrice: 200,
        duration: "1-2 hours",
        durationMinutes: 90,
        location: "In-home",
        isPrimary: true,
        isPopular: true,
        icon: "Utensils",
        color: "bg-destructive/10",
        iconColor: "text-destructive",
        includes: [
          "Menu planning consultation",
          "Meal preparation",
          "Kitchen cleanup",
          "Leftover storage guidance"
        ],
        requirements: [
          "Access to kitchen",
          "Refrigerator space",
          "Someone present during service"
        ],
        nextAvailable: "Today 6:00 PM",
        bookingNotice: "Same day",
        cancellationPolicy: "2 hours notice"
      },
      {
        id: "service-002",
        name: "Meal Preparation Package",
        description: "Weekly meal prep with fresh ingredients and customized menus",
        shortDescription: "Weekly meal preparation service",
        fullDescription: `Complete weekly meal preparation service including menu planning, grocery shopping, cooking, and packaging.\n\nService includes 5 days of meals with 2-3 options per day, customized to your dietary preferences and requirements. All meals are prepared fresh and properly stored for easy reheating.`,
        price: 1200,
        duration: "3-4 hours",
        durationMinutes: 240,
        location: "In-home",
        isPrimary: true,
        icon: "ShoppingBag",
        color: "bg-primary/10",
        iconColor: "text-primary",
        pricingTiers: [
          {
            name: "Basic Package",
            description: "5 days of meals, 2 options per day",
            price: 1200
          },
          {
            name: "Premium Package",
            description: "7 days of meals, 3 options per day",
            price: 1800
          },
          {
            name: "Family Package",
            description: "7 days of family-sized meals",
            price: 2200
          }
        ],
        includes: [
          "Menu consultation",
          "Grocery shopping",
          "Meal preparation and cooking",
          "Proper storage and labeling"
        ],
        requirements: [
          "Access to kitchen for 3-4 hours",
          "Refrigerator and freezer space",
          "Grocery list preferences"
        ],
        nextAvailable: "Next Monday",
        bookingNotice: "1 week",
        cancellationPolicy: "48 hours notice"
      },
      {
        id: "service-003",
        name: "Special Occasion Catering",
        description: "Catering services for special events and celebrations",
        shortDescription: "Event catering for celebrations",
        fullDescription: `Professional catering service for special occasions including birthday parties, anniversaries, and family gatherings.\n\nService includes menu planning, ingredient sourcing, cooking, serving, and cleanup. Customizable menus to suit your event requirements and guest preferences.`,
        price: 500,
        duration: "4-6 hours",
        durationMinutes: 360,
        location: "In-home or venue",
        isPrimary: false,
        icon: "Cake",
        color: "bg-secondary/10",
        iconColor: "text-secondary",
        includes: [
          "Menu consultation",
          "Event day cooking",
          "Serving and presentation",
          "Kitchen cleanup"
        ],
        nextAvailable: "Tomorrow 10:00 AM",
        bookingNotice: "24 hours",
        cancellationPolicy: "4 hours notice"
      }
    ],
    servicePackages: [
      {
        name: "Weekly Meal Prep Package",
        description: "Weekly meal preparation with fresh ingredients",
        price: 299,
        originalPrice: 450,
        services: [
          "Weekly menu planning",
          "Grocery shopping",
          "5 days of prepared meals",
          "Kitchen cleanup"
        ]
      },
      {
        name: "Family Feast Package",
        description: "Complete home cooking service for the whole family",
        price: 1899,
        originalPrice: 2400,
        services: [
          "Custom menu planning",
          "Specialty dish preparation",
          "Family-sized portions",
          "Complete kitchen cleanup"
        ]
      }
    ],
    weeklyAvailability: [
      { day: "Mon", date: "24", available: true, slots: 6 },
      { day: "Tue", date: "25", available: true, slots: 4 },
      { day: "Wed", date: "26", available: true, slots: 8 },
      { day: "Thu", date: "27", available: false, slots: 0 },
      { day: "Fri", date: "28", available: true, slots: 5 },
      { day: "Sat", date: "29", available: true, slots: 3 },
      { day: "Sun", date: "30", available: false, slots: 0 }
    ],
    reviews: [
      {
        id: 1,
        customerName: "Sonam Gupta",
        customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "2024-07-20",
        serviceType: "Home Cooking",
        comment: `Mohan prepared a delicious meal with perfect seasoning and presentation. The flavors were exceptional!`,
        verified: true,
        photos: [
          "/assets/images/dishes/review1.jpeg",
          "/assets/images/dishes/review2.jpeg"
        ],
        helpfulCount: 12,
        providerResponse: "Thank you Sonam for your kind words! I'm delighted you enjoyed the meal. Feel free to reach out for any future dining needs."
      },
      {
        id: 2,
        customerName: "Rohit Gupta",
        customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "2024-07-18",
        serviceType: "Meal Preparation",
        comment: `Outstanding meal preparation! Mohan transformed our ordinary ingredients into an extraordinary dining experience.`,
        verified: true,
        photos: [
          "/assets/images/dishes/review3.jpeg"
        ],
        helpfulCount: 8
      },
      {
        id: 3,
        customerName: "Anjali Sharma",
        customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 4,
        date: "2024-07-15",
        serviceType: "Special Occasion Meal",
        comment: `Great service! He arrived on time and quickly solve the issue with our kitchen drain.`,
        verified: true,
        helpfulCount: 5
      },
      {
        id: 4,
        customerName: "Preeti Sinha",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        date: "2024-07-12",
        serviceType: "Weekly Meal Prep",
        comment: `Mohan installed our new water heater and did an excellent job.`,
        verified: true,
        helpfulCount: 7
      }
    ],
    gallery: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop",
        title: "Delicious Indian Thali",
        description: "Complete meal with traditional Indian dishes",
        category: "completed",
        date: "July 2024",
        location: "Ashoka Rd, New Delhi"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
        title: "Home Cooking Service",
        description: "Freshly prepared meals in customer's kitchen",
        category: "completed",
        date: "June 2024",
        location: "Ashoka Rd, New Delhi"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        title: "Before: Kitchen Setup",
        description: "Kitchen before cooking service",
        category: "before-after",
        date: "June 2024",
        location: "Ashoka Rd, New Delhi"
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop",
        title: "Meal Preparation",
        description: "Chef preparing fresh ingredients",
        category: "process",
        date: "July 2024",
        location: "Ashoka Rd, New Delhi"
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=400&fit=crop",
        title: "Special Occasion Catering",
        description: "Catering service for birthday celebration",
        category: "completed",
        date: "July 2024",
        location: "Ashoka Rd, New Delhi"
      },
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1585128792020-803d29415281?w=400&h=400&fit=crop",
        title: "Family Feast Preparation",
        description: "Preparing a special family meal",
        category: "completed",
        date: "July 2024",
        location: "Ashoka Rd, New Delhi"
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'reviews', label: 'Reviews', icon: 'Star', count: provider.reviewCount },
    { id: 'gallery', label: 'Gallery', icon: 'Image', count: provider.gallery.length },
    { id: 'services', label: 'Services', icon: 'List', count: provider.services.length }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${provider.name} - ${provider.serviceCategory}`,
          text: `Check out ${provider.name}'s profile on UrbanEase`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically save to user's favorites
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab provider={provider} />;
      case 'reviews':
        return <ReviewsTab provider={provider} />;
      case 'gallery':
        return <GalleryTab provider={provider} />;
      case 'services':
        return <ServicesTab provider={provider} />;
      default:
        return <OverviewTab provider={provider} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading provider profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {/* Provider Hero Section */}
        <ProviderHero
          provider={provider}
          onShare={handleShare}
          onFavorite={handleFavorite}
          isFavorited={isFavorited}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Tab Content */}
            <div className="flex-1 lg:w-2/3">
              {renderTabContent()}
            </div>

            {/* Booking Widget - Desktop Sidebar */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <BookingWidget provider={provider} isSticky={true} />
            </div>
          </div>
        </div>

        {/* Mobile Booking Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">
                ${provider.services[0].price}
              </div>
              <div className="text-sm text-muted-foreground">
                {provider.services[0].duration}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = `tel:${provider.phone}`}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium"
              >
                Call Now
              </button>
              <button
                onClick={() => navigate('/service-booking-scheduling', { 
                  state: { provider, service: provider.services[0] } 
                })}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfiles;