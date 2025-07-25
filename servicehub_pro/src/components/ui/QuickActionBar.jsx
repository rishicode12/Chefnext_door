import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionBar = ({ userLocation = 'Delhi', userHistory = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Quick action items based on user context and time
  const quickActions = [
    {
      id: 'emergency',
      title: 'Emergency Service',
      subtitle: 'Available 24/7',
      icon: 'AlertTriangle',
      color: 'bg-destructive text-destructive-foreground',
      urgent: true,
      action: () => console.log('Emergency service requested'),
    },
    {
      id: 'cleaning',
      title: 'House Cleaning',
      subtitle: 'Next available: Today 3 PM',
      icon: 'Sparkles',
      color: 'bg-primary text-primary-foreground',
      popular: true,
      action: () => console.log('House cleaning booked'),
    },
    {
      id: 'plumbing',
      title: 'Plumbing',
      subtitle: 'Same day service',
      icon: 'Wrench',
      color: 'bg-secondary text-secondary-foreground',
      action: () => console.log('Plumbing service requested'),
    },
    {
      id: 'electrical',
      title: 'Electrical',
      subtitle: 'Licensed electricians',
      icon: 'Zap',
      color: 'bg-warning text-warning-foreground',
      action: () => console.log('Electrical service requested'),
    },
    {
      id: 'handyman',
      title: 'Handyman',
      subtitle: 'Fix anything',
      icon: 'Hammer',
      color: 'bg-success text-success-foreground',
      action: () => console.log('Handyman service requested'),
    },
    {
      id: 'repeat',
      title: 'Book Again',
      subtitle: 'Your last cleaner',
      icon: 'RotateCcw',
      color: 'bg-accent text-accent-foreground',
      repeat: true,
      action: () => console.log('Repeat booking requested'),
    },
  ];

  const visibleActions = isExpanded ? quickActions : quickActions.slice(0, 4);

  const handleQuickAction = (action) => {
    action.action();
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Popular services in {userLocation}
          </p>
        </div>
        {quickActions.length > 4 && (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <Icon 
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
              size={16} 
              className="ml-1" 
            />
          </Button>
        )}
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            className="group relative p-4 rounded-lg border border-border hover:border-primary/50 bg-background hover:bg-muted/50 transition-all duration-200 hover:scale-105 text-left"
          >
            {/* Urgent Badge */}
            {action.urgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
            )}
            
            {/* Popular Badge */}
            {action.popular && (
              <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                Popular
              </div>
            )}

            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={action.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {action.subtitle}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
          {visibleActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className="group relative flex-shrink-0 w-32 p-3 rounded-lg border border-border hover:border-primary/50 bg-background active:bg-muted transition-all duration-200 text-left"
            >
              {/* Urgent Badge */}
              {action.urgent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              )}

              <div className={`p-2 rounded-lg ${action.color} mb-2 w-fit`}>
                <Icon name={action.icon} size={18} />
              </div>
              
              <h4 className="font-medium text-foreground text-sm mb-1 truncate">
                {action.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {action.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Time-sensitive Notice */}
      <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-accent" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Peak hours:</span> Book now for same-day service
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickActionBar;