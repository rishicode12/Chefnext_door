import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentMethodsTab = ({ user, onSave }) => {
  const [paymentMethods, setPaymentMethods] = useState(user.paymentMethods || [
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
        street: 'Rajiv Chowk',
        city: 'Delhi',
        state: 'New Delhi',
        zipCode: '10001'
      }
    },
    {
      id: 2,
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expiryMonth: '08',
      expiryYear: '2026',
      holderName: 'John Doe',
      isDefault: false,
      billingAddress: {
        street: '456 Oak Avenue',
        city: 'Delhi',
        state: 'New Delhi',
        zipCode: '10002'
      }
    }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [errors, setErrors] = useState({});

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa': return 'CreditCard';
      case 'mastercard': return 'CreditCard';
      case 'amex': return 'CreditCard';
      default: return 'CreditCard';
    }
  };

  const getCardBrandColor = (brand) => {
    switch (brand) {
      case 'visa': return 'text-blue-600';
      case 'mastercard': return 'text-red-600';
      case 'amex': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleNewCardChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewCard(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setNewCard(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateNewCard = () => {
    const newErrors = {};
    
    if (!newCard.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
    if (!newCard.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
    if (!newCard.expiryYear) newErrors.expiryYear = 'Expiry year is required';
    if (!newCard.cvv) newErrors.cvv = 'CVV is required';
    if (!newCard.holderName.trim()) newErrors.holderName = 'Cardholder name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = () => {
    if (validateNewCard()) {
      const cardToAdd = {
        id: Date.now(),
        type: 'card',
        brand: 'visa', // In real app, detect from card number
        last4: newCard.cardNumber.slice(-4),
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        holderName: newCard.holderName,
        isDefault: paymentMethods.length === 0,
        billingAddress: newCard.billingAddress
      };
      
      setPaymentMethods(prev => [...prev, cardToAdd]);
      setShowAddCard(false);
      setNewCard({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        billingAddress: { street: '', city: '', state: '', zipCode: '' }
      });
      onSave([...paymentMethods, cardToAdd]);
    }
  };

  const setDefaultPaymentMethod = (id) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updatedMethods);
    onSave(updatedMethods);
  };

  const removePaymentMethod = (id) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    onSave(updatedMethods);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Payment Methods</h2>
          <p className="text-sm text-muted-foreground">Manage your saved payment methods and billing information</p>
        </div>
        <Button
          variant="default"
          onClick={() => setShowAddCard(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Payment Method
        </Button>
      </div>

      {/* Saved Payment Methods */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-muted ${getCardBrandColor(method.brand)}`}>
                  <Icon name={getCardIcon(method.brand)} size={24} />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground capitalize">
                      {method.brand} •••• {method.last4}
                    </span>
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expiryMonth}/{method.expiryYear} • {method.holderName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    onClick={() => setDefaultPaymentMethod(method.id)}
                    size="sm"
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => removePaymentMethod(method.id)}
                  size="sm"
                  iconName="Trash2"
                  className="text-destructive hover:text-destructive"
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Billing Address</h4>
              <p className="text-sm text-muted-foreground">
                {method.billingAddress.street}<br />
                {method.billingAddress.city}, {method.billingAddress.state} {method.billingAddress.zipCode}
              </p>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Payment Methods</h3>
            <p className="text-muted-foreground mb-4">Add a payment method to start booking services</p>
            <Button
              variant="default"
              onClick={() => setShowAddCard(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Payment Method
            </Button>
          </div>
        )}
      </div>

      {/* Add New Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Add Payment Method</h3>
              <Button
                variant="ghost"
                onClick={() => setShowAddCard(false)}
                size="sm"
                iconName="X"
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Card Number"
                type="text"
                value={newCard.cardNumber}
                onChange={(e) => handleNewCardChange('cardNumber', formatCardNumber(e.target.value))}
                error={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Month"
                  type="text"
                  value={newCard.expiryMonth}
                  onChange={(e) => handleNewCardChange('expiryMonth', e.target.value)}
                  error={errors.expiryMonth}
                  placeholder="MM"
                  maxLength={2}
                  required
                />
                
                <Input
                  label="Expiry Year"
                  type="text"
                  value={newCard.expiryYear}
                  onChange={(e) => handleNewCardChange('expiryYear', e.target.value)}
                  error={errors.expiryYear}
                  placeholder="YYYY"
                  maxLength={4}
                  required
                />
              </div>

              <Input
                label="CVV"
                type="text"
                value={newCard.cvv}
                onChange={(e) => handleNewCardChange('cvv', e.target.value)}
                error={errors.cvv}
                placeholder="123"
                maxLength={4}
                required
              />

              <Input
                label="Cardholder Name"
                type="text"
                value={newCard.holderName}
                onChange={(e) => handleNewCardChange('holderName', e.target.value)}
                error={errors.holderName}
                placeholder="Jayesh Mehta"
                required
              />

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">Billing Address</h4>
                
                <div className="space-y-3">
                  <Input
                    label="Street Address"
                    type="text"
                    value={newCard.billingAddress.street}
                    onChange={(e) => handleNewCardChange('billingAddress.street', e.target.value)}
                    placeholder="123 Main Street"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="City"
                      type="text"
                      value={newCard.billingAddress.city}
                      onChange={(e) => handleNewCardChange('billingAddress.city', e.target.value)}
                      placeholder="New Delhi"
                    />
                    
                    <Input
                      label="State"
                      type="text"
                      value={newCard.billingAddress.state}
                      onChange={(e) => handleNewCardChange('billingAddress.state', e.target.value)}
                      placeholder="New Delhi"
                    />
                  </div>
                  
                  <Input
                    label="ZIP Code"
                    type="text"
                    value={newCard.billingAddress.zipCode}
                    onChange={(e) => handleNewCardChange('billingAddress.zipCode', e.target.value)}
                    placeholder="110001"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddCard(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddCard}
                fullWidth
              >
                Add Card
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Security Info */}
      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Secure Payments</h4>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsTab;