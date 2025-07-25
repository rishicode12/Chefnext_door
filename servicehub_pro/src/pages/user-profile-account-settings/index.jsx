import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import PersonalInfoTab from './components/PersonalInfoTab';
import PreferencesTab from './components/PreferencesTab';
import PaymentMethodsTab from './components/PaymentMethodsTab';
import SecurityTab from './components/SecurityTab';

const UserProfileAccountSettings = () => {
  const [activeTab, setActiveTab] = useState('personal');

  // Mock user data
  const [userData, setUserData] = useState({
    id: 1,
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    memberSince: "January 2023",
    dateOfBirth: "1990-05-15",
    gender: "male",
    bio: "Tech enthusiast who loves exploring new services and connecting with local professionals.",
    emailVerified: true,
    phoneVerified: true,
    identityVerified: false,
    totalBookings: 24,
    favoriteProviders: 8,
    loyaltyPoints: 1250,
    addresses: [
      {
        id: 1,
        type: 'home',
        label: 'Home',
        street: 'Satya Niketan Rd',
        city: 'Delhi',
        state: 'New Delhi',
        zipCode: '110001',
        isDefault: true
      },
      {
        id: 2,
        type: 'work',
        label: 'Office',
        street: '456 Rajiv Chowk',
        city: 'Delhi',
        state: 'New Delhi',
        zipCode: '110002',
        isDefault: false
      }
    ],
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Spouse",
      phone: "+91 (555) 987-6543"
    },
    preferences: {
      serviceCategories: ['cleaning', 'plumbing', 'electrical'],
      notifications: {
        push: true,
        email: true,
        sms: false,
        marketing: false
      },
      language: 'en',
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false
      },
      privacy: {
        shareData: false,
        publicProfile: true,
        showActivity: true
      }
    },
    paymentMethods: [
      {
        id: 1,
        type: 'card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: '12',
        expiryYear: '2025',
        holderName: 'John Doe',
        isDefault: true,
        billingAddress: {
          street: 'Satya Niketan Rd',
          city: 'Delhi',
          state: 'New Delhi',
          zipCode: '10001'
        }
      }
    ],
    twoFactorEnabled: false
  });

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      description: 'Basic information',
      icon: 'User'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Customize experience',
      icon: 'Settings'
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      description: 'Manage payments',
      icon: 'CreditCard'
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Account security',
      icon: 'Shield'
    }
  ];

  const handleImageUpload = () => {
    // In real app, implement image upload functionality
    console.log('Image upload triggered');
  };

  const handleEditProfile = () => {
    setActiveTab('personal');
  };

  const handleSavePersonalInfo = (data) => {
    setUserData(prev => ({
      ...prev,
      ...data,
      name: `${data.firstName} ${data.lastName}`
    }));
  };

  const handleSavePreferences = (preferences) => {
    setUserData(prev => ({
      ...prev,
      preferences
    }));
  };

  const handleSavePaymentMethods = (paymentMethods) => {
    setUserData(prev => ({
      ...prev,
      paymentMethods
    }));
  };

  const handleSaveSecurity = (securityData) => {
    setUserData(prev => ({
      ...prev,
      ...securityData
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoTab
            user={userData}
            onSave={handleSavePersonalInfo}
          />
        );
      case 'preferences':
        return (
          <PreferencesTab
            user={userData}
            onSave={handleSavePreferences}
          />
        );
      case 'payment':
        return (
          <PaymentMethodsTab
            user={userData}
            onSave={handleSavePaymentMethods}
          />
        );
      case 'security':
        return (
          <SecurityTab
            user={userData}
            onSave={handleSaveSecurity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile & Account Settings - ServiceHub Pro</title>
        <meta name="description" content="Manage your profile, preferences, payment methods, and security settings on ServiceHub Pro" />
      </Helmet>

      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <ProfileHeader
            user={userData}
            onImageUpload={handleImageUpload}
            onEditProfile={handleEditProfile}
          />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tab Navigation */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

            {/* Main Content */}
            <div className="flex-1 lg:max-w-4xl">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileAccountSettings;