import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { IWILLogo } from '../components/ui/iwil-logo-svg';

export function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    organization: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store authentication token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('staffUser', JSON.stringify(data.user));
        
        // Redirect to intended destination or dashboard
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen iwil-gradient-subtle flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg sm:max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center mb-3 sm:mb-4">
            <IWILLogo size={56} className="sm:w-16 sm:h-16 mx-auto" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Join IWIL Protocol</h1>
          <p className="text-sm sm:text-base text-gray-600">Create your professional account to get started</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm sm:text-base">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-11 text-base sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-11 text-base sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-11 text-base sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-11 text-base sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm sm:text-base">Professional Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="nutritionist">Nutritionist</SelectItem>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="wellness-coach">Wellness Coach</SelectItem>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm sm:text-base">Organization</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="organization"
                    type="text"
                    placeholder="Enter your organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-11 text-base sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 sm:pl-12 pr-12 h-12 sm:h-11 text-base sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-5 w-5 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 sm:pl-12 pr-12 h-12 sm:h-11 text-base sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-5 w-5 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 sm:h-4 sm:w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded mt-1 touch-manipulation"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-slate-700 hover:text-slate-900 font-medium touch-manipulation">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-slate-700 hover:text-slate-900 font-medium touch-manipulation">
                  Privacy Policy
                </Link>
                . I understand that this platform handles sensitive health information in compliance with HIPAA regulations.
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full iwil-gradient hover:opacity-90 text-white font-medium py-3 sm:py-2.5 h-12 sm:h-auto text-base sm:text-sm touch-manipulation"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-slate-700 hover:text-slate-900 font-medium touch-manipulation"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs text-gray-500">
            HIPAA-compliant • Secure • Professional
          </p>
        </div>
      </div>
    </div>
  );
}
