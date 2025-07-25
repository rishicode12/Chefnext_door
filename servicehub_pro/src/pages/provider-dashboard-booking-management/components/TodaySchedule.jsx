import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TodaySchedule = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      time: "09:00 AM",
      duration: "2 hours",
      customer: {
        name: "Sarah Johnson",
        phone: "+91 (555) 123-4567",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      service: "House Cleaning",
      location: "123 Oak Street, Manhattan",
      status: "confirmed",
      price: "₹120",
      notes: "Deep cleaning required for kitchen and bathrooms"
    },
    {
      id: 2,
      time: "02:00 PM",
      duration: "1.5 hours",
      customer: {
        name: "Michael Chen",
        phone: "+91 (555) 987-6543",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      service: "Plumbing Repair",
      location: "456 Pine Avenue, Brooklyn",
      status: "in_progress",
      price: "₹85",
      notes: "Kitchen sink leak repair"
    },
    {
      id: 3,
      time: "05:30 PM",
      duration: "1 hour",
      customer: {
        name: "Emily Rodriguez",
        phone: "+91 (555) 456-7890",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      service: "Electrical Work",
      location: "789 Elm Street, Queens",
      status: "upcoming",
      price: "₹95",
      notes: "Install new ceiling fan in living room"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success/10 text-success border-success/20';
      case 'in_progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'upcoming': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'in_progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleMessage = (customer) => {
    console.log(`Opening message to ${customer.name}`);
  };

  const handleNavigate = (location) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Today's Schedule</h2>
            <p className="text-sm text-muted-foreground">
              {appointments.length} appointments scheduled
            </p>
          </div>
          <Button variant="outline" iconName="Calendar" iconPosition="left">
            View Calendar
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium text-foreground mb-2">No appointments today</h3>
            <p className="text-sm text-muted-foreground">Your schedule is clear for today</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="bg-background border border-border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              {/* Time and Status Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold text-foreground">
                    {appointment.time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ({appointment.duration})
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={appointment.customer.avatar}
                    alt={appointment.customer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">
                    {appointment.customer.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-1">
                    {appointment.service}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Icon name="MapPin" size={14} />
                    <span className="truncate">{appointment.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="RupeeSign" size={14} />
                    <span className="font-medium text-success">{appointment.price}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Notes:</span> {appointment.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Phone"
                    onClick={() => handleCall(appointment.customer.phone)}
                  >
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MessageCircle"
                    onClick={() => handleMessage(appointment.customer)}
                  >
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Navigation"
                    onClick={() => handleNavigate(appointment.location)}
                  >
                    Navigate
                  </Button>
                </div>

                {/* Status Update Buttons */}
                <div className="flex items-center space-x-2">
                  {appointment.status === 'confirmed' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStatusUpdate(appointment.id, 'in_progress')}
                    >
                      Start Service
                    </Button>
                  )}
                  {appointment.status === 'in_progress' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                    >
                      Complete
                    </Button>
                  )}
                  {appointment.status === 'upcoming' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Clock"
                    >
                      Waiting
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;