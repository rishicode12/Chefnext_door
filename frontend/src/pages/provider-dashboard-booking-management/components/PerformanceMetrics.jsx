import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceMetrics = () => {
  const [timeframe, setTimeframe] = useState('today');

  const metrics = {
    today: {
      earnings: "₹500",
      bookings: 6,
      rating: 4.9,
      completionRate: 95,
      responseTime: "12 min",
      nextPayment: {
        amount: "₹1,000",
        date: "July 26, 2025"
      }
    },
    week: {
      earnings: "₹2,840",
      bookings: 28,
      rating: 4.8,
      completionRate: 92,
      responseTime: "15 min",
      nextPayment: {
        amount: "₹1,240",
        date: "July 26, 2025"
      }
    },
    month: {
      earnings: "₹12,650",
      bookings: 124,
      rating: 4.9,
      completionRate: 94,
      responseTime: "13 min",
      nextPayment: {
        amount: "₹1,240",
        date: "July 26, 2025"
      }
    }
  };

  const currentMetrics = metrics[timeframe];

  const recentActivity = [
    {
      id: 1,
      type: "booking_completed",
      title: "Service Completed",
      description: "Home cooking for Sarah Johnson",
      amount: "+₹120",
      time: "2 hours ago",
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      id: 2,
      type: "payment_received",
      title: "Payment Received",
      description: "Weekly payout processed",
      amount: "+₹840",
      time: "1 day ago",
      icon: "DollarSign",
      color: "text-primary"
    },
    {
      id: 3,
      type: "new_review",
      title: "New Review",
      description: "5-star review from Rohit Gupta",
      amount: "★ 5.0",
      time: "2 days ago",
      icon: "Star",
      color: "text-warning"
    },
    {
      id: 4,
      type: "booking_request",
      title: "New Booking Request",
      description: "Electrical work in Queens",
      amount: "₹280",
      time: "3 days ago",
      icon: "Calendar",
      color: "text-accent"
    }
  ];

  const upcomingPayments = [
    {
      id: 1,
      description: "Weekly earnings payout",
      amount: "₹1,240",
      date: "July 26, 2025",
      status: "pending"
    },
    {
      id: 2,
      description: "Bonus payment",
      amount: "₹150",
      date: "July 30, 2025",
      status: "scheduled"
    }
  ];

  const getTimeframeLabel = (tf) => {
    switch (tf) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'Today';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Performance</h2>
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {['today', 'week', 'month'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                    timeframe === tf
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {getTimeframeLabel(tf)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Earnings</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.earnings}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Bookings</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.bookings}
              </div>
            </div>

            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Star" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Rating</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.rating}
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Completion</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {currentMetrics.completionRate}%
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Avg Response Time</span>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {currentMetrics.responseTime}
                </div>
              </div>
              <div className="text-xs text-success font-medium">
                ↓ 3 min faster
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Upcoming Payments</h3>
            <Button variant="ghost" size="sm" iconName="ExternalLink">
              View All
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {upcomingPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Banknote" size={18} className="text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {payment.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-success">
                  {payment.amount}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'pending' ?'bg-warning/10 text-warning' :'bg-primary/10 text-primary'
                }`}>
                  {payment.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>

        <div className="p-6 space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                <Icon name={activity.icon} size={14} className={activity.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  activity.amount.startsWith('+') ? 'text-success' : 
                  activity.amount.startsWith('★') ? 'text-warning' : 'text-foreground'
                }`}>
                  {activity.amount}
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;