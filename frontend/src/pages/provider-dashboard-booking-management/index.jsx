import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TodaySchedule from './components/TodaySchedule';
import BookingRequests from './components/BookingRequests';
import PerformanceMetrics from './components/PerformanceMetrics';
import QuickActionsToolbar from './components/QuickActionsToolbar';
import ProviderNavigation from './components/ProviderNavigation';

const ProviderDashboardBookingManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  // Mock provider data
  const providerData = {
    name: "Chef Hari Khanna\'s Culinary Services",
    avatar: "/assets/images/dishes/chefim.jpeg",
    rating: 4.9,
    totalReviews: 247,
    completedJobs: 1250,
    responseTime: "12 min",
    joinDate: "January 2023"
  };

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const mockNotifications = [
        "New booking request from Sarah Johnson",
        "Payment of ₹520 received",
        "Customer left a 5-star review"
      ];
      
      if (Math.random() > 0.8) {
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: randomNotification,
          time: new Date().toLocaleTimeString()
        }]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-6">
            {/* Today's Schedule */}
            <div className="w-full">
              <TodaySchedule />
            </div>

            {/* Booking Requests */}
            <div className="w-full">
              <BookingRequests />
            </div>

            {/* Performance Metrics */}
            <div className="w-full">
              <PerformanceMetrics />
            </div>

            {/* Quick Actions Toolbar */}
            <div className="w-full">
              <QuickActionsToolbar />
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-center py-12">
              <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-foreground mb-2">All Bookings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive booking management view
              </p>
              <Button variant="outline">
                View Full Calendar
              </Button>
            </div>
          </div>
        );

      case 'requests':
        return <BookingRequests />;

      case 'profile':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-center py-12">
              <Icon name="User" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-foreground mb-2">Provider Profile</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your service profile and settings
              </p>
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-center py-12">
              <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-foreground mb-2">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Detailed performance insights and reports
              </p>
              <Button variant="outline">
                View Analytics
              </Button>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-center py-12">
              <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-foreground mb-2">Payment Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Track earnings, payouts, and payment history
              </p>
              <Button variant="outline">
                View Payments
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Provider Dashboard - UrbanEase</title>
        <meta name="description" content="Manage your service business with comprehensive booking management, customer communication, and performance analytics." />
      </Helmet>

      {/* Provider Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={providerData.avatar}
                  alt={providerData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, Chef Hari Khanna!
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span>{providerData.rating} ({providerData.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>{providerData.completedJobs} jobs completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>Avg response: {providerData.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Status & Quick Actions */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                isOnline 
                  ? 'bg-success/10 text-success border-success/20' :'bg-muted text-muted-foreground border-border'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                }`}></div>
                <span className="text-sm font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              <Button
                variant={isOnline ? "destructive" : "success"}
                onClick={() => setIsOnline(!isOnline)}
                iconName={isOnline ? "Pause" : "Play"}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ProviderNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Notifications Bar */}
        {notifications.length > 0 && (
          <div className="mb-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Bell" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Recent Activity
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotifications([])}
                iconName="X"
              >
                Clear
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {notifications.slice(-3).map((notification) => (
                <div key={notification.id} className="text-sm text-muted-foreground">
                  {notification.message} - {notification.time}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-4 gap-1 p-2">
          {['dashboard', 'bookings', 'requests', 'profile'].map((tab) => {
            const tabData = {
              dashboard: { icon: 'LayoutDashboard', label: 'Dashboard' },
              bookings: { icon: 'Calendar', label: 'Bookings' },
              requests: { icon: 'Inbox', label: 'Requests' },
              profile: { icon: 'User', label: 'Profile' }
            }[tab];

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tabData.icon} size={18} />
                <span className="text-xs font-medium">{tabData.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default ProviderDashboardBookingManagement;