import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesTab = ({ user, onSave }) => {
  const [preferences, setPreferences] = useState({
    serviceCategories: user.preferences?.serviceCategories || [],
    notifications: user.preferences?.notifications || {
      push: true,
      email: true,
      sms: false,
      marketing: false
    },
    language: user.preferences?.language || 'en',
    accessibility: user.preferences?.accessibility || {
      highContrast: false,
      largeText: false,
      screenReader: false
    },
    privacy: user.preferences?.privacy || {
      shareData: false,
      publicProfile: false,
      showActivity: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const serviceCategories = [
    { id: 'pizza', name: 'Pizza', icon: 'Pizza' },
    { id: 'chinese', name: 'Chinese', icon: 'BowlFood' },
    { id: 'south-indian', name: 'South Indian', icon: 'Soup' },
    { id: 'indian', name: 'Indian', icon: 'Utensils' },
    { id: 'burgers', name: 'Burgers', icon: 'Hamburger' },
    { id: 'rolls', name: 'Rolls', icon: 'Croissant' },
    { id: 'dosa', name: 'Dosa', icon: 'Croissant' },
    { id: 'cakes', name: 'Cakes', icon: 'Cake' },
    { id: 'juices', name: 'Juices', icon: 'Wine' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' }
  ];

  const handleServiceCategoryToggle = (categoryId) => {
    setPreferences(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(categoryId)
        ? prev.serviceCategories.filter(id => id !== categoryId)
        : [...prev.serviceCategories, categoryId]
    }));
  };

  const handleNotificationChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value }
    }));
  };

  const handleAccessibilityChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, [type]: value }
    }));
  };

  const handlePrivacyChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [type]: value }
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground">Customize your experience and notification settings</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          iconName={isEditing ? "Save" : "Settings"}
          iconPosition="left"
        >
          {isEditing ? 'Save Changes' : 'Edit Preferences'}
        </Button>
      </div>

      {/* Service Categories */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Service Interests</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select services you're interested in to receive personalized recommendations
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => isEditing && handleServiceCategoryToggle(category.id)}
              className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                preferences.serviceCategories.includes(category.id)
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              } ${!isEditing ? 'cursor-default' : ''}`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`p-2 rounded-lg ${
                  preferences.serviceCategories.includes(category.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={category.icon} size={20} />
                </div>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
                {preferences.serviceCategories.includes(category.id) && (
                  <Icon name="Check" size={16} className="text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Notification Settings</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Push Notifications"
            description="Receive notifications on your device"
            checked={preferences.notifications.push}
            onChange={(e) => handleNotificationChange('push', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="Email Notifications"
            description="Get updates via email"
            checked={preferences.notifications.email}
            onChange={(e) => handleNotificationChange('email', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="SMS Notifications"
            description="Receive text messages for important updates"
            checked={preferences.notifications.sms}
            onChange={(e) => handleNotificationChange('sms', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="Marketing Communications"
            description="Receive promotional offers and updates"
            checked={preferences.notifications.marketing}
            onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Language & Region</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Accessibility</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="High Contrast Mode"
            description="Increase contrast for better visibility"
            checked={preferences.accessibility.highContrast}
            onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="Large Text"
            description="Increase text size throughout the app"
            checked={preferences.accessibility.largeText}
            onChange={(e) => handleAccessibilityChange('largeText', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="Screen Reader Support"
            description="Optimize for screen reader compatibility"
            checked={preferences.accessibility.screenReader}
            onChange={(e) => handleAccessibilityChange('screenReader', e.target.checked)}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Privacy Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Privacy Controls</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Share Usage Data"
            description="Help improve our service by sharing anonymous usage data"
            checked={preferences.privacy.shareData}
            onChange={(e) => handlePrivacyChange('shareData', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="Public Profile"
            description="Make your profile visible to service providers"
            checked={preferences.privacy.publicProfile}
            onChange={(e) => handlePrivacyChange('publicProfile', e.target.checked)}
            disabled={!isEditing}
          />
          
          <Checkbox
            label="Show Activity Status"
            description="Let others see when you're active"
            checked={preferences.privacy.showActivity}
            onChange={(e) => handlePrivacyChange('showActivity', e.target.checked)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;