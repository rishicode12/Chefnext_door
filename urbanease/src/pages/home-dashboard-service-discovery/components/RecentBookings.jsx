import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentBookings = ({ bookings, onRebook, onRate, onContact }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'upcoming':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'CheckCircle';
      case 'upcoming':
        return 'Clock';
      case 'in-progress':
        return 'Play';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Bookings</h2>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-medium text-foreground mb-2">No bookings yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start by booking your first service
          </p>
          <Button variant="default">
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Bookings</h2>
        <Button variant="ghost" className="text-sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {bookings.slice(0, 3).map((booking) => (
          <div
            key={booking.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              {/* Provider Image */}
              <div className="flex-shrink-0">
                <Image
                  src={booking.providerImage}
                  alt={booking.providerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* Booking Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground truncate">
                      {booking.serviceName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      with {booking.providerName}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border {getStatusColor(booking.status)}`}>
                    <div className="flex items-center space-x-1">
                      <Icon name={getStatusIcon(booking.status)} size={12} />
                      <span>{booking.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="IndianRupee" size={14} />
                    <span>₹{booking.amount}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {booking.status.toLowerCase() === 'completed' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => onRebook(booking)}
                        className="text-xs px-3 py-1 h-auto"
                      >
                        <Icon name="RotateCcw" size={12} className="mr-1" />
                        Rebook
                      </Button>
                      {!booking.rated && (
                        <Button
                          variant="outline"
                          onClick={() => onRate(booking)}
                          className="text-xs px-3 py-1 h-auto"
                        >
                          <Icon name="Star" size={12} className="mr-1" />
                          Rate
                        </Button>
                      )}
                    </>
                  )}
                  
                  {booking.status.toLowerCase() === 'upcoming' && (
                    <Button
                      variant="outline"
                      onClick={() => onContact(booking)}
                      className="text-xs px-3 py-1 h-auto"
                    >
                      <Icon name="MessageCircle" size={12} className="mr-1" />
                      Contact
                    </Button>
                  )}

                  {booking.status.toLowerCase() === 'in-progress' && (
                    <Button
                      variant="default"
                      className="text-xs px-3 py-1 h-auto"
                    >
                      <Icon name="MapPin" size={12} className="mr-1" />
                      Track
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;