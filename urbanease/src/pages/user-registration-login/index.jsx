import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import OTPVerification from './components/OTPVerification';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import LanguageSelector from './components/LanguageSelector';

const UserRegistrationLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showOTP, setShowOTP] = useState(false);
  const [otpContactInfo, setOtpContactInfo] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Background service categories for visual appeal
  const serviceCategories = [
    { name: 'Cleaning', icon: 'Sparkles', color: 'text-blue-500' },
    { name: 'Plumbing', icon: 'Wrench', color: 'text-green-500' },
    { name: 'Electrical', icon: 'Zap', color: 'text-yellow-500' },
    { name: 'Handyman', icon: 'Hammer', color: 'text-purple-500' },
    { name: 'Beauty', icon: 'Scissors', color: 'text-pink-500' },
    { name: 'Fitness', icon: 'Dumbbell', color: 'text-red-500' },
  ];

  const handleOTPVerification = (contactInfo) => {
    setOtpContactInfo(contactInfo);
    setShowOTP(true);
  };

  const handleOTPBack = () => {
    setShowOTP(false);
    setOtpContactInfo('');
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    setOtpContactInfo('');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Floating Service Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {serviceCategories.map((category, index) => (
          <div
            key={category.name}
            className={`absolute opacity-10 animate-float ${
              index % 2 === 0 ? 'animation-delay-1000' : 'animation-delay-2000'
            }`}
            style={{
              left: `${10 + (index * 15)}%`,
              top: `${20 + (index * 10)}%`,
              animationDuration: `${4 + (index * 0.5)}s`,
            }}
          >
            <div className={`p-4 rounded-full bg-background/20 backdrop-blur-sm ${category.color}`}>
              <Icon name={category.icon} size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 lg:p-6">
        <Link to="/home-dashboard-service-discovery" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={24} color="white" />
          </div>
          <span className="text-xl font-bold text-foreground">UrbanEase</span>
        </Link>

        <LanguageSelector />
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {activeTab === 'login' ? 'Welcome Back!' : 'Join UrbanEase'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'login' ? 'Sign in to access your account and book services' : 'Create your account to start booking local services'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 backdrop-blur-sm">
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'login' ? (
              <LoginForm onForgotPassword={handleForgotPassword} />
            ) : (
              <RegisterForm onOTPVerification={handleOTPVerification} />
            )}
          </div>

          {/* Additional Links */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              {activeTab === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                {activeTab === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} className="text-success" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} className="text-primary" />
                <span>10K+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning" />
                <span>4.9 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} UrbanEase. All rights reserved.</p>
      </footer>

      {/* Modals */}
      {showOTP && (
        <OTPVerification
          contactInfo={otpContactInfo}
          onBack={handleOTPBack}
          onSuccess={handleOTPSuccess}
        />
      )}

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default UserRegistrationLogin;