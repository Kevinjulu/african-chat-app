import React, { useState, useEffect } from 'react';
import { FaUser, FaArrowLeft, FaDrum, FaLock, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const avatars = [
    '👤', '👨🏾', '👩🏾', '🧔🏾', '👱🏾‍♀️', '👨🏾‍🦱', 
    '👩🏾‍🦱', '👨🏾‍🦰', '👩🏾‍🦰', '👨🏾‍🦳', '👩🏾‍🦳', '👨🏾‍🦲'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.username.trim().length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const userData = {
      ...formData,
      avatar: avatars[selectedAvatar]
    };

    try {
      await register(userData);
      navigate('/chat');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/patterns/adinkra.svg')] bg-repeat animate-slide-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Login</span>
            </button>
            <div className="flex items-center space-x-3">
              <FaDrum className="text-3xl text-orange-500 animate-bounce" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                AfriChat
              </span>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Left Column - Register Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text mb-4">
                  Create Your Account
                </h2>
                <p className="text-gray-400">
                  Join our vibrant community and start chatting today
                </p>
              </div>

              {/* Avatar Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Your Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {avatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAvatar(index)}
                      className={`text-2xl p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                        selectedAvatar === index
                          ? 'bg-orange-500/30 border-2 border-orange-500 scale-110'
                          : 'bg-black/20 border border-orange-500/20 hover:border-orange-500/50'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-orange-500" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-orange-500/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-white"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-orange-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-orange-500/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-white"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-orange-500" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-orange-500/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-white"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-orange-500" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-orange-500/20 rounded-lg bg-black/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 text-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-300 hover:scale-105"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-orange-500 hover:text-orange-400 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="lg:block hidden">
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-bold text-white mb-4">Join Our Community</h3>
                  <p className="text-gray-400">
                    Connect with people from across Africa and share your stories in our themed chat rooms.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-bold text-white mb-4">Express Yourself</h3>
                  <p className="text-gray-400">
                    Choose from our collection of African-themed avatars and make your presence unique.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-xl font-bold text-white mb-4">Safe & Secure</h3>
                  <p className="text-gray-400">
                    Your privacy and security are our top priorities. Chat with peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
