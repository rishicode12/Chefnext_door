import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsToolbar = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const quickActions = [
    {
      id: 'availability',
      title: 'Toggle Availability',
      description: 'Turn on/off booking availability',
      icon: isAvailable ? 'ToggleRight' : 'ToggleLeft',
      color: isAvailable ? 'text-success' : 'text-muted-foreground',
      action: () => setIsAvailable(!isAvailable)
    },
    {
      id: 'calendar',
      title: 'Calendar Sync',
      description: 'Sync with Google Calendar',
      icon: 'Calendar',
      color: 'text-primary',
      action: () => console.log('Opening calendar sync')
    },
    {
      id: 'pricing',
      title: 'Update Pricing',
      description: 'Modify service rates',
      icon: 'RupeeSign',
      color: 'text-accent',
      action: () => console.log('Opening pricing editor')
    },
    {
      id: 'schedule',
      title: 'Manage Schedule',
      description: 'Set working hours',
      icon: 'Clock',
      color: 'text-warning',
      action: () => setShowAvailabilityModal(true)
    },
    {
      id: 'messages',
      title: 'Customer Messages',
      description: 'View all conversations',
      icon: 'MessageSquare',
      color: 'text-secondary',
      action: () => console.log('Opening messages')
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Business insights',
      icon: 'BarChart3',
      color: 'text-primary',
      action: () => console.log('Opening analytics')
    }
  ];

  const todayStats = {
    totalBookings: 6,
    completedBookings: 3,
    earnings: "₹485",
    avgRating: 4.9,
    responseTime: "12 min"
  };

  const handleBulkAction = (action) => {
    console.log(`Performing bulk action: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Availability Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Availability Status</h3>
            <p className="text-sm text-muted-foreground">
              {isAvailable ? 'Currently accepting bookings' : 'Not accepting new bookings'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isAvailable 
              ? 'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground border border-border'
          }`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </div>
        </div>

        <Button
          variant={isAvailable ? "destructive" : "success"}
          fullWidth
          iconName={isAvailable ? "Pause" : "Play"}
          onClick={() => setIsAvailable(!isAvailable)}
        >
          {isAvailable ? 'Go Offline' : 'Go Online'}
        </Button>
      </div>

      {/* Today's Quick Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Today's Overview</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-sm text-foreground">Bookings</span>
            </div>
            <span className="font-semibold text-foreground">
              {todayStats.completedBookings}/{todayStats.totalBookings}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={16} className="text-success" />
              <span className="text-sm text-foreground">Earnings</span>
            </div>
            <span className="font-semibold text-success">
              {todayStats.earnings}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Star" size={16} className="text-warning" />
              <span className="text-sm text-foreground">Rating</span>
            </div>
            <span className="font-semibold text-foreground">
              {todayStats.avgRating}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-accent" />
              <span className="text-sm text-foreground">Response</span>
            </div>
            <span className="font-semibold text-foreground">
              {todayStats.responseTime}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full flex items-center space-x-3 p-3 bg-background hover:bg-muted/50 border border-border rounded-lg transition-colors duration-200 text-left"
            >
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center`}>
                <Icon name={action.icon} size={16} className={action.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Bulk Actions</h3>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            iconName="CheckSquare"
            onClick={() => handleBulkAction('mark_completed')}
          >
            Mark All as Completed
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="MessageCircle"
            onClick={() => handleBulkAction('send_reminders')}
          >
            Send Reminders
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            onClick={() => handleBulkAction('export_data')}
          >
            Export Today's Data
          </Button>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="AlertTriangle" size={20} className="text-destructive" />
          <h3 className="font-semibold text-destructive">Emergency Support</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Need immediate assistance with a booking or customer issue?
        </p>
        <Button
          variant="destructive"
          fullWidth
          iconName="Phone"
          onClick={() => window.open('tel:+91-800-SUPPORT', '_self')}
        >
          Call Support
        </Button>
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Manage Schedule</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowAvailabilityModal(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Working Hours Today
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Start Time</label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">End Time</label>
                    <input
                      type="time"
                      defaultValue="18:00"
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="break-time"
                  className="rounded border-border"
                />
                <label htmlFor="break-time" className="text-sm text-foreground">
                  Include lunch break (12:00 PM - 1:00 PM)
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => setShowAvailabilityModal(false)}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowAvailabilityModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsToolbar;