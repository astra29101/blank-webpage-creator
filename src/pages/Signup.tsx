import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, Shield, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGoogleAuthCallback } from '@/hooks/useGoogleAuthCallback';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const { register, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  useGoogleAuthCallback();

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmail = (email: string) => {
    return email.endsWith('@gmail.com');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.endsWith('@gmail.com')) {
      toast({
        title: 'Invalid Email',
        description: 'Please use a Gmail address to sign up.',
        variant: 'destructive',
      });
      return;
    }
    if (otpCooldown > 0) return;
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, mode: 'signup' }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        setOtpSent(true);
        setStep('otp');
        setOtpCooldown(60);
        toast({ title: 'OTP Sent', description: 'Check your email for the OTP.' });
      } else if (data.message === 'User already exists') {
        toast({
          title: 'User Already Exists',
          description: 'This email is already registered. Please login instead.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Failed to send OTP', description: data.message || 'Try again.', variant: 'destructive' });
      }
    } catch (err) {
      setLoading(false);
      toast({ title: 'Failed to send OTP', description: 'Try again.', variant: 'destructive' });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      setLoading(false);
      if (response.ok) {
        setOtpVerified(true);
        toast({ title: 'OTP Verified', description: 'You can now create your account.' });
      } else {
        toast({ title: 'Invalid OTP', description: 'Please check your OTP and try again.', variant: 'destructive' });
      }
    } catch {
      setLoading(false);
      toast({ title: 'Error', description: 'Failed to verify OTP.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please use a Gmail address to sign up.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (!otpVerified) {
      toast({
        title: 'OTP Not Verified',
        description: 'Please verify your OTP before creating an account.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const success = await register(formData.name, formData.email, formData.password, otp);
      if (success) {
        toast({
          title: 'Account Created',
          description: 'Welcome to EduFlow!',
        });
        navigate('/student');
      } else {
        toast({
          title: 'Signup Failed',
          description: 'Email may already be in use or OTP not verified.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Unexpected error. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:animate-glow">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold gradient-text">EduFlow</span>
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Join the Future</h2>
          <p className="text-gray-600 text-lg">Create your account and start your learning journey today</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl modern-shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your Gmail address"
                    className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Must be a Gmail address for verification
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Send Verification Code
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200"
                  onClick={() => {
                    window.location.href = `${SERVER_URL}/api/auth/google`;
                  }}
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  Continue with Google
                </Button>

                <div className="text-center pt-4">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                    Sign in
                  </Link>
                </div>
              </form>
            ) : step === 'otp' && !otpVerified ? (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                  <p className="text-gray-600">Enter the 6-digit code we sent to {formData.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-gray-700 font-semibold">Verification Code</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit code"
                    className="h-12 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
                  <p className="text-gray-600">Just a few more details to get started</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your Gmail address"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a strong password"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Create My Account
                    </div>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
