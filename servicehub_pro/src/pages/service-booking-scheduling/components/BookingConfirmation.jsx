import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const BookingConfirmation = ({ bookingData }) => {
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [showProviderContact, setShowProviderContact] = useState(false);

  // Mock provider data
  const provider = {
    id: 1,
    name: "Sarah\'s Cleaning Service",
    rating: 4.9,
    reviewCount: 247,
    phone: "+91 123-4567",
    email: "sarah@cleaningservice.com",
    avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
    experience: "5+ years",
    verified: true
  };

  const handleAddToCalendar = () => {
    setIsAddingToCalendar(true);
    
    // Create calendar event data
    const eventData = {
      title: `${bookingData.service.name} - ServiceHub Pro`,
      start: bookingData.schedule.date,
      description: `Service: ${bookingData.service.name}\nProvider: ${provider.name}\nLocation: ${bookingData.location.address}\nConfirmation: ${bookingData.confirmationNumber}`,
      location: `${bookingData.location.address}, ${bookingData.location.city}, ${bookingData.location.state} ${bookingData.location.zipCode}`
    };

    // Simulate adding to calendar
    setTimeout(() => {
      setIsAddingToCalendar(false);
      alert('Event added to your calendar!');
    }, 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ServiceHub Pro Booking Confirmation',
        text: `My ${bookingData.service.name} is scheduled for ${bookingData.schedule.date.toLocaleDateString()} at ${bookingData.schedule.timeSlot.time}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      const shareText = `My ${bookingData.service.name} is scheduled for ${bookingData.schedule.date.toLocaleDateString()} at ${bookingData.schedule.timeSlot.time}. Confirmation: ${bookingData.confirmationNumber}`;
      navigator.clipboard.writeText(shareText);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={40} className="text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Your service has been successfully booked. You'll receive a confirmation email shortly.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Booking Details</h2>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Confirmation Number</p>
            <p className="font-mono font-semibold text-primary">{bookingData.confirmationNumber}</p>
          </div>
        </div>

        {/* Service Information */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
              <Image
                src={bookingData.service.image}
                alt={bookingData.service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{bookingData.service.name}</h3>
              <p className="text-sm text-muted-foreground">
                {bookingData.service.selectedOption?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Quantity: {bookingData.service.quantity || 1}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">₹{bookingData.payment.amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground capitalize">{bookingData.payment.method}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center space-x-3 py-3 border-t border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {bookingData.schedule.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {bookingData.schedule.timeSlot.time} ({bookingData.service.duration})
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-3 py-3 border-t border-border">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="MapPin" size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Service Location</p>
              <p className="text-sm text-muted-foreground">
                {bookingData.location.address}
                {bookingData.location.apartment && `, ${bookingData.location.apartment}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {bookingData.location.city}, {bookingData.location.state} {bookingData.location.zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Your Service Provider</h3>
        
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={provider.avatar}
              alt={provider.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-foreground">{provider.name}</h4>
              {provider.verified && (
                <Icon name="BadgeCheck" size={16} className="text-primary" />
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <span>{provider.rating}</span>
                <span>({provider.reviewCount} reviews)</span>
              </div>
              <span>{provider.experience}</span>
            </div>
            
            {showProviderContact ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Phone" size={14} className="text-primary" />
                  <a href={`tel:${provider.phone}`} className="text-primary hover:underline">
                    {provider.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Mail" size={14} className="text-primary" />
                  <a href={`mailto:${provider.email}`} className="text-primary hover:underline">
                    {provider.email}
                  </a>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowProviderContact(true)}
                className="text-sm h-8 px-3"
              >
                Show Contact Info
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          onClick={handleAddToCalendar}
          loading={isAddingToCalendar}
          iconName="Calendar"
          iconPosition="left"
          className="justify-center"
        >
          Add to Calendar
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShare}
          iconName="Share"
          iconPosition="left"
          className="justify-center"
        >
          Share Booking
        </Button>
      </div>

      {/* Important Information */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Important Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your provider will contact you 30 minutes before arrival</li>
              <li>• Please ensure someone is available at the service location</li>
              <li>• You can reschedule up to 2 hours before your appointment</li>
              <li>• Payment will be processed after service completion</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link to="/user-profile-account-settings" className="flex-1">
          <Button variant="outline" className="w-full justify-center">
            View My Bookings
          </Button>
        </Link>
        
        <Link to="/home-dashboard-service-discovery" className="flex-1">
          <Button className="w-full justify-center">
            Book Another Service
          </Button>
        </Link>
      </div>

      {/* Emergency Contact */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          Need help with your booking?
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a
            href="tel:+91-800-SERVICE"
            className="flex items-center space-x-2 text-sm text-primary hover:underline"
          >
            <Icon name="Phone" size={14} />
            <span>(800) SERVICE</span>
          </a>
          <a
            href="mailto:support@servicepro.com"
            className="flex items-center space-x-2 text-sm text-primary hover:underline"
          >
            <Icon name="Mail" size={14} />
            <span>support@servicepro.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;