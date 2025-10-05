import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const SecurityTab = ({ user, onSave }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorEnabled || false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [errors, setErrors] = useState({});

  const loginActivity = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Delhi, New Delhi ',
      timestamp: '2025-07-24 10:30 AM',
      current: true,
      ip: '192.168.1.1'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Delhi, New Delhi',
      timestamp: '2025-07-23 08:15 PM',
      current: false,
      ip: '192.168.1.2'
    },
    {
      id: 3,
      device: 'Chrome on Android',
      location: 'Rjiv Chowk, New Delhi',
      timestamp: '2025-07-22 02:45 PM',
      current: false,
      ip: '192.168.1.3'
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPasswordChange = () => {
    if (validatePasswordChange()) {
      // In real app, make API call to change password
      onSave({ passwordChanged: true });
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    onSave({ twoFactorEnabled: !twoFactorEnabled });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      // In real app, make API call to delete account
      onSave({ accountDeleted: true });
    }
  };

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('Android')) return 'Smartphone';
    if (device.includes('iPad') || device.includes('Tablet')) return 'Tablet';
    return 'Monitor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account security and privacy settings</p>
      </div>

      {/* Password Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Password</h3>
            <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowChangePassword(true)}
            iconName="Key"
            iconPosition="left"
          >
            Change Password
          </Button>
        </div>

        {showChangePassword && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                error={errors.currentPassword}
                required
              />
              
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                error={errors.newPassword}
                description="Must be at least 8 characters long"
                required
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className="flex space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmitPasswordChange}
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${
              twoFactorEnabled ? 'text-success' : 'text-muted-foreground'
            }`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              variant={twoFactorEnabled ? "destructive" : "default"}
              onClick={handleToggleTwoFactor}
              iconName={twoFactorEnabled ? "ShieldOff" : "Shield"}
              iconPosition="left"
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-success">Two-factor authentication is active</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              You'll receive a verification code via SMS when logging in from a new device.
            </p>
          </div>
        )}
      </div>

      {/* Login Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Recent Login Activity</h3>
        
        <div className="space-y-4">
          {loginActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Icon name={getDeviceIcon(activity.device)} size={20} className="text-muted-foreground" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{activity.device}</span>
                    {activity.current && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.location} • {activity.timestamp}
                  </p>
                  <p className="text-xs text-muted-foreground">IP: {activity.ip}</p>
                </div>
              </div>

              {!activity.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="LogOut"
                  className="text-destructive hover:text-destructive"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Sign Out All Other Sessions
        </Button>
      </div>

      {/* Account Deletion */}
      <div className="bg-card border border-destructive/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-destructive mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <Button
              variant="destructive"
              onClick={() => setShowDeleteAccount(true)}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Account
            </Button>
          </div>
        </div>

        {showDeleteAccount && (
          <div className="mt-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <h4 className="font-medium text-foreground mb-2">Confirm Account Deletion</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Type "DELETE" to confirm that you want to permanently delete your account.
            </p>
            
            <Input
              label="Confirmation"
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="mb-4"
            />

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteAccount(false);
                  setDeleteConfirmation('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
              >
                Delete Account Permanently
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Security Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication for added security</li>
              <li>• Regularly review your login activity</li>
              <li>• Never share your login credentials with others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;