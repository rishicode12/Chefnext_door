import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your cleaning service is scheduled for tomorrow at 2 PM',
      time: '2 hours ago',
      read: false,
      icon: 'Calendar',
      color: 'text-success',
    },
    {
      id: 2,
      type: 'completion',
      title: 'Service Completed',
      message: 'Please rate your experience with John\'s Plumbing',
      time: '1 day ago',
      read: false,
      icon: 'CheckCircle',
      color: 'text-primary',
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Upcoming Service',
      message: 'Your electrician will arrive in 30 minutes',
      time: '30 minutes ago',
      read: true,
      icon: 'Clock',
      color: 'text-warning',
    },
    {
      id: 4,
      type: 'promotion',
      title: 'Special Offer',
      message: '20% off your next home cleaning service',
      time: '2 days ago',
      read: true,
      icon: 'Gift',
      color: 'text-accent',
    },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'booking': return 'bg-success/10 border-success/20';
      case 'completion': return 'bg-primary/10 border-primary/20';
      case 'reminder': return 'bg-warning/10 border-warning/20';
      case 'promotion': return 'bg-accent/10 border-accent/20';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted transition-colors duration-200"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border border-border rounded-lg shadow-lg z-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-popover-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                onClick={markAllAsRead}
                className="text-xs px-2 py-1 h-auto"
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm font-medium text-popover-foreground mb-1">No notifications</p>
                <p className="text-xs text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors duration-200 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${getNotificationTypeColor(notification.type)}`}>
                      <Icon name={notification.icon} size={16} className={notification.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-popover-foreground mb-1">
                            {notification.title}
                            {!notification.read && (
                              <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2"></span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 h-auto text-xs"
                            >
                              <Icon name="Check" size={12} />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 h-auto text-xs text-muted-foreground hover:text-destructive"
                          >
                            <Icon name="X" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button variant="ghost" className="w-full text-sm justify-center">
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;