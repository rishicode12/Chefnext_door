import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Discover', path: '/home-dashboard-service-discovery', icon: 'Home' },
    { label: 'Book Service', path: '/service-booking-scheduling', icon: 'Calendar' },
    { label: 'Providers', path: '/service-provider-profiles', icon: 'Users' },
    { label: 'My Account', path: '/user-profile-account-settings', icon: 'User' },
  ];

  const moreItems = [
    { label: 'Provider Dashboard', path: '/provider-dashboard-booking-management', icon: 'BarChart3' },
    { label: 'Help & Support', path: '/help', icon: 'HelpCircle' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/home-dashboard-service-discovery" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">YummyFoods</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* More Menu */}
          <div className="relative group">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Icon name="MoreHorizontal" size={16} />
              <span>More</span>
            </Button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {moreItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-popover-foreground hover:bg-muted rounded-lg"
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart Button */}
          <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
            <Icon name="ShoppingCart" size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </Link>
          
          {/* Authentication Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link to="/user-registration-login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              Login
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/user-registration-login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
              Sign Up
            </Link>
          </div>
          
          {/* Location Selector */}
          <Button variant="ghost" className="hidden lg:flex items-center space-x-2 px-3 py-2">
            <Icon name="MapPin" size={16} />
            <span className="text-sm">Delhi</span>
            <Icon name="ChevronDown" size={14} />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={toggleNotifications}
              className="relative p-2"
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-300">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-muted">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-popover-foreground">Booking Confirmed</p>
                        <p className="text-xs text-muted-foreground">Your chef booking is scheduled for tomorrow at 2 PM</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-muted">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-popover-foreground">Service Completed</p>
                        <p className="text-xs text-muted-foreground">Please rate your experience with Chef Hari's Kitchen</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            onClick={toggleMobileMenu}
            className="lg:hidden p-2"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-4 space-y-2">
            {/* Authentication Links for Mobile */}
            <div className="flex justify-between mb-4 border-b border-border pb-4">
              <Link
                to="/user-registration-login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-3 text-center rounded-l-lg bg-primary/10 text-primary font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to="/user-registration-login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-3 text-center rounded-r-lg bg-primary text-primary-foreground font-medium text-sm"
              >
                Sign Up
              </Link>
            </div>
            
            {/* Cart Link for Mobile */}
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium bg-muted/50 text-foreground hover:bg-muted transition-colors duration-200 mb-2"
            >
              <div className="flex items-center space-x-3">
                <Icon name="ShoppingCart" size={18} />
                <span>Shopping Cart</span>
              </div>
              <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-border pt-2 mt-4">
              {moreItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Location Selector */}
            <div className="border-t border-border pt-4 mt-4">
              <Button variant="outline" className="w-full justify-start space-x-2">
                <Icon name="MapPin" size={16} />
                <span>Change Location: Delhi</span>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Highlight bar for visual appeal */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary/50"></div>
    </header>
  );
};

export default Header;