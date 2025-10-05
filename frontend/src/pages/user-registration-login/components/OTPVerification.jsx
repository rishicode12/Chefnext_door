import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OTPVerification = ({ contactInfo, onBack, onSuccess }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Mock OTP for demo
  const mockOTP = '123456';

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      setTimeout(() => handleVerify(newOtp.join('')), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (otpCode === mockOTP) {
        // Store user data in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'customer');
        localStorage.setItem('userVerified', 'true');
        
        // Show success animation before redirecting
        setOtp(['✓', '✓', '✓', '✓', '✓', '✓']);
        
        // Delay navigation to show success state
        setTimeout(() => {
          onSuccess?.();
          navigate('/home-dashboard-service-discovery');
        }, 1000);
      } else {
        setError('Invalid verification code. Please try again.');
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError('');

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setError('');
      
      // Restart timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const formatContactInfo = (contact) => {
    if (contact.includes('@')) {
      // Email - mask middle part
      const [username, domain] = contact.split('@');
      const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 4) + username.slice(-2);
      return `${maskedUsername}@${domain}`;
    } else {
      // Phone - mask middle digits
      return contact.replace(/(\+?\d{2})\d+(\d{4})/, '$1****$2');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Verify Your Account
          </h2>
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-foreground">
              {formatContactInfo(contactInfo)}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg font-semibold border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          <Button
            onClick={() => handleVerify()}
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={otp.some(digit => digit === '')}
          >
            Verify Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend in {resendTimer}s
              </p>
            )}
          </div>

          <Button
            onClick={onBack}
            variant="ghost"
            fullWidth
            className="mt-4"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back to Registration
          </Button>
        </div>

        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <Icon name="Info" size={14} className="inline mr-1" />
            For demo purposes, use OTP: <span className="font-mono font-medium">123456</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;