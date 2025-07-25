import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PersonalInfoTab = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    bio: user.bio || ''
  });

  const [addresses, setAddresses] = useState(user.addresses || [
    {
      id: 1,
      type: 'home',
      label: 'Home',
      street: '123 Main Street',
      city: 'Delhi',
      state: 'New Delhi',
      zipCode: '110001',
      isDefault: true
    }
  ]);

  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || {
    name: '',
    relationship: '',
    phone: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setEmergencyContact(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ ...formData, addresses, emergencyContact });
      setIsEditing(false);
    }
  };

  const addAddress = () => {
    const newAddress = {
      id: Date.now(),
      type: 'other',
      label: 'New Address',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    };
    setAddresses(prev => [...prev, newAddress]);
  };

  const updateAddress = (id, field, value) => {
    setAddresses(prev =>
      prev.map(addr =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const removeAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev =>
      prev.map(addr => ({ ...addr, isDefault: addr.id === id }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground">Manage your personal details and contact information</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          iconName={isEditing ? "Save" : "Edit"}
          iconPosition="left"
        >
          {isEditing ? 'Save Changes' : 'Edit Info'}
        </Button>
      </div>

      {/* Basic Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            error={errors.firstName}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            error={errors.lastName}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            disabled={!isEditing}
            required
          />
          
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-foreground block mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Saved Addresses</h3>
          {isEditing && (
            <Button
              variant="outline"
              onClick={addAddress}
              iconName="Plus"
              iconPosition="left"
              size="sm"
            >
              Add Address
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">{address.label}</span>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setDefaultAddress(address.id)}
                      size="sm"
                      disabled={address.isDefault}
                    >
                      Set Default
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => removeAddress(address.id)}
                      size="sm"
                      iconName="Trash2"
                      className="text-destructive hover:text-destructive"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Street Address"
                  type="text"
                  value={address.street}
                  onChange={(e) => updateAddress(address.id, 'street', e.target.value)}
                  disabled={!isEditing}
                />
                
                <Input
                  label="City"
                  type="text"
                  value={address.city}
                  onChange={(e) => updateAddress(address.id, 'city', e.target.value)}
                  disabled={!isEditing}
                />
                
                <Input
                  label="State"
                  type="text"
                  value={address.state}
                  onChange={(e) => updateAddress(address.id, 'state', e.target.value)}
                  disabled={!isEditing}
                />
                
                <Input
                  label="ZIP Code"
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => updateAddress(address.id, 'zipCode', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Emergency Contact</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Contact Name"
            type="text"
            value={emergencyContact.name}
            onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
            disabled={!isEditing}
            placeholder="Full name"
          />
          
          <Input
            label="Relationship"
            type="text"
            value={emergencyContact.relationship}
            onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
            disabled={!isEditing}
            placeholder="e.g., Spouse, Parent"
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={emergencyContact.phone}
            onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
            disabled={!isEditing}
            placeholder="Contact number"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;