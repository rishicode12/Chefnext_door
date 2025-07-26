import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ProviderNavigation = ({ activeTab, onTabChange }) => {
  const location = useLocation();

  const navigationTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview & today\'s schedule'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'Calendar',
      description: 'Manage all appointments',
      badge: 3
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: 'Inbox',
      description: 'Pending booking requests',
      badge: 5
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      description: 'Service profile & settings'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Performance insights'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: 'CreditCard',
      description: 'Earnings & payouts'
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <nav className="flex space-x-1 py-4">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${
                    activeTab === tab.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Icon 
                name={navigationTabs.find(tab => tab.id === activeTab)?.icon || 'LayoutDashboard'} 
                size={20} 
                className="text-primary" 
              />
              <div>
                <h2 className="font-semibold text-foreground">
                  {navigationTabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {navigationTabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
            
            {/* Mobile Menu Dropdown */}
            <div className="relative group">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
                <Icon name="MoreVertical" size={20} className="text-muted-foreground" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-300">
                <div className="p-2">
                  {navigationTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-left ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span>{tab.label}</span>
                          {tab.badge && (
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              activeTab === tab.id
                                ? 'bg-primary-foreground/20 text-primary-foreground'
                                : 'bg-accent text-accent-foreground'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs opacity-75 mt-0.5">
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <div className="flex space-x-1 pb-4 overflow-x-auto">
            {navigationTabs.slice(0, 4).map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-medium ${
                    activeTab === tab.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderNavigation;