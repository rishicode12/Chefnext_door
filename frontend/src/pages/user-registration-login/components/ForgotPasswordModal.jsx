import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'reset'
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!formData.emailOrPhone.trim()) {
      setErrors({ emailOrPhone: 'Email or phone number is required' });
      return;
    }
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-()]+$/;
    
    if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
      setErrors({ emailOrPhone: 'Please enter a valid email or phone number' });
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success feedback
      setStep('otp');
      
      // For demo purposes - show a hint in console
      console.log('Demo verification code: 123456');
    } catch (error) {
      console.error('Password reset request error:', error);
      setErrors({ emailOrPhone: 'Failed to send reset code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.otp.trim()) {
      setErrors({ otp: 'Please enter the verification code' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formData.otp === '123456') {
        setStep('reset');
      } else {
        setErrors({ otp: 'Invalid code. Please try again. (Use: 123456)' });
      }
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Enhanced password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      } else {
        const hasUpperCase = /[A-Z]/.test(formData.newPassword);
        const hasLowerCase = /[a-z]/.test(formData.newPassword);
        const hasNumbers = /\d/.test(formData.newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
        
        if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
          newErrors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
        }
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message before closing
      const successMessage = document.createElement('div');
      successMessage.innerHTML = `
        <div class="fixed inset-0 flex items-center justify-center z-50">
          <div class="bg-success/10 p-4 rounded-lg shadow-lg text-center">
            <div class="text-success text-2xl mb-2">✓</div>
            <div class="font-medium">Password Reset Successful!</div>
          </div>
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // Remove success message and close modal after delay
      setTimeout(() => {
        document.body.removeChild(successMessage);
        
        // Success - close modal
        onClose();
        
        // Reset form
        setStep('email');
        setFormData({
          emailOrPhone: '',
          otp: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'Password reset failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Lock" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email or phone number to receive a reset code
        </p>
      </div>

      <Input
        label="Email or Phone Number"
        type="text"
        name="emailOrPhone"
        placeholder="Enter your email or phone"
        value={formData.emailOrPhone}
        onChange={handleInputChange}
        error={errors.emailOrPhone}
        required
      />

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
      >
        Send Reset Code
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleOTPSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Shield" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Enter Verification Code
        </h2>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to {formData.emailOrPhone}
        </p>
      </div>

      <Input
        label="Verification Code"
        type="text"
        name="otp"
        placeholder="Enter 6-digit code"
        value={formData.otp}
        onChange={handleInputChange}
        error={errors.otp}
        maxLength={6}
        required
      />

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('email')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          className="flex-1"
        >
          Verify Code
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Demo code: <span className="font-mono font-medium">123456</span>
        </p>
      </div>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Create New Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for your account
        </p>
      </div>

      {errors.general && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}

      <Input
        label="New Password"
        type="password"
        name="newPassword"
        placeholder="Enter new password"
        value={formData.newPassword}
        onChange={handleInputChange}
        error={errors.newPassword}
        required
      />

      <Input
        label="Confirm New Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm new password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        error={errors.confirmPassword}
        required
      />

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
      >
        Reset Password
      </Button>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {step === 'email' && renderEmailStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'reset' && renderResetStep()}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;