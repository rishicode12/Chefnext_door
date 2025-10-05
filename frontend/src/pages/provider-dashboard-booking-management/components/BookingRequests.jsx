import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      customer: {
        name: "David Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        totalBookings: 12
      },
      service: "Weekly Meal Prep",
      requestedDate: "2025-07-25",
      requestedTime: "10:00 AM",
      duration: "3 hours",
      location: "321 Maple Drive, Manhattan",
      price: "₹500",
      urgency: "normal",
      description: `Need weekly meal preparation service for family of 4.\nPrefer North Indian cuisine with vegetarian options.\nNeed meals for 5 days with 2-3 options per day.`,
      requestTime: "2 hours ago",
      specialRequests: ["Vegetarian options", "North Indian cuisine", "Proper storage"]
    },
    {
      id: 2,
      customer: {
        name: "Lisa Thompson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        totalBookings: 8
      },
      service: "Urgent Meal Prep",
      requestedDate: "2025-07-24",
      requestedTime: "ASAP",
      duration: "2 hours",
      location: "567 Cedar Street, Brooklyn",
      price: "₹500",
      urgency: "urgent",
      description: `Need urgent meal preparation for unexpected guests.\nRequire 10 servings of North Indian dishes.\nWilling to pay premium for same-day service.`,
      requestTime: "30 minutes ago",
      specialRequests: ["Emergency service", "Same-day availability", "Large portions"]
    },
    {
      id: 3,
      customer: {
        name: "Robert Garcia",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        rating: 4.6,
        totalBookings: 15
      },
      service: "Special Occasion Catering",
      requestedDate: "2025-07-26",
      requestedTime: "02:00 PM",
      duration: "4 hours",
      location: "890 Birch Avenue, Queens",
      price: "₹500",
      urgency: "normal",
      description: `Need catering service for birthday party of 20 guests.\nPrefer Italian cuisine with vegetarian options.\nWeekend scheduling preferred for minimal disruption.`,
      requestTime: "1 day ago",
      specialRequests: ["Vegetarian options", "Weekend service", "Minimal disruption"]
    }
  ]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'normal': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High Priority';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  };

  const handleAcceptRequest = (requestId) => {
    setRequests(prev => prev.filter(request => request.id !== requestId));
    // Show success notification
    console.log(`Booking request ${requestId} accepted`);
  };

  const handleDeclineRequest = (requestId) => {
    setRequests(prev => prev.filter(request => request.id !== requestId));
    // Show decline notification
    console.log(`Booking request ${requestId} declined`);
  };

  const handleCounterOffer = (requestId) => {
    console.log(`Opening counter offer for request ${requestId}`);
  };

  const handleViewProfile = (customer) => {
    console.log(`Viewing profile for ${customer.name}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Booking Requests</h2>
            <p className="text-sm text-muted-foreground">
              {requests.length} pending requests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filter
            </Button>
            <Button variant="outline" size="sm" iconName="SortDesc">
              Sort
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium text-foreground mb-2">No pending requests</h3>
            <p className="text-sm text-muted-foreground">New booking requests will appear here</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-background border border-border rounded-lg p-5 hover:shadow-sm transition-shadow duration-200">
              {/* Header with urgency and time */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                  {getUrgencyText(request.urgency)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {request.requestTime}
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={request.customer.avatar}
                    alt={request.customer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {request.customer.name}
                    </h3>
                    <button
                      onClick={() => handleViewProfile(request.customer)}
                      className="text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      <Icon name="ExternalLink" size={14} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-warning fill-current" />
                      <span>{request.customer.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{request.customer.totalBookings} bookings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h4 className="font-medium text-primary mb-2">{request.service}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Icon name="Calendar" size={14} />
                        <span>{request.requestedDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span>{request.requestedTime} ({request.duration})</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Icon name="MapPin" size={14} />
                        <span className="truncate">{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="DollarSign" size={14} className="text-success" />
                        <span className="font-semibold text-success">{request.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <h5 className="font-medium text-foreground mb-2">Service Description:</h5>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {request.description}
                  </p>
                </div>

                {/* Special Requests */}
                {request.specialRequests.length > 0 && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Special Requests:</h5>
                    <div className="flex flex-wrap gap-2">
                      {request.specialRequests.map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="success"
                    size="sm"
                    iconName="Check"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    iconName="X"
                    onClick={() => handleDeclineRequest(request.id)}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MessageSquare"
                    onClick={() => handleCounterOffer(request.id)}
                  >
                    Counter Offer
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageCircle"
                  >
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Phone"
                  >
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingRequests;