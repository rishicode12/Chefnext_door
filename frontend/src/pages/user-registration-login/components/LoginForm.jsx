import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for demo
  const mockCredentials = {
    email: 'user@urbanease.com',
    phone: '+1234567890',
    password: 'password123'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else {
      // Basic validation for email or phone format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-()]+$/;
      
      if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
        newErrors.emailOrPhone = 'Please enter a valid email or phone number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    // Clear any previous errors
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check mock credentials
      const isValidEmail = formData.emailOrPhone === mockCredentials.email && formData.password === mockCredentials.password;
      const isValidPhone = formData.emailOrPhone === mockCredentials.phone && formData.password === mockCredentials.password;

      if (isValidEmail || isValidPhone) {
        // Store auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'customer');
        
        // Navigate to home dashboard
        navigate('/home-dashboard-service-discovery');
      } else {
        // More user-friendly error message
        setErrors({
          general: 'Invalid email/phone or password. Please try again.'
        });
        
        // For demo purposes only - show hint
        console.log('Demo credentials: user@urbanease.com / password123');
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
    // Simulate successful social login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', 'customer');
    navigate('/home-dashboard-service-discovery');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}

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

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
        />
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        className="mt-6"
      >
        Sign In
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('Google')}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Chrome" size={18} />
          <span>Google</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('Facebook')}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Facebook" size={18} />
          <span>Facebook</span>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;