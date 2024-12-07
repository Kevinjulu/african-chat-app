import React, { useState, useEffect } from 'react';
import { FaUser, FaArrowLeft, FaDrum, FaMask, FaGlobe, FaUsers, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const avatars = [
    '👤', '👨🏾', '👩🏾', '🧔🏾', '👱🏾‍♀️', '👨🏾‍🦱', 
    '👩🏾‍🦱', '👨🏾‍🦰', '👩🏾‍🦰', '👨🏾‍🦳', '👩🏾‍🦳', '👨🏾‍🦲'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }
    
    const userData = {
      username: username.trim(),
      avatar: avatars[selectedAvatar]
    };
    
    login(userData);
    navigate('/chat');
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
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <FaDrum className="text-3xl text-orange-500 animate-bounce" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                AfriChat
              </span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className={`max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Left Column - Login Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text mb-4">
                  Welcome to AfriChat
                </h2>
                <p className="text-gray-400">
                  Choose your avatar and enter your username to begin your journey
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-black/20 border border-orange-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      placeholder="Enter your username"
                      minLength={3}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <FaUser className="text-orange-500/50" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-lg font-medium hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Chatting
                    <FaGlobe className="ml-2 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
              </form>

              {/* Features */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-4 border border-orange-500/20">
                  <FaMask className="text-orange-500 text-xl mb-2" />
                  <h3 className="font-medium mb-1">Anonymous Chat</h3>
                  <p className="text-sm text-gray-400">No registration required</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4 border border-orange-500/20">
                  <FaGlobe className="text-orange-500 text-xl mb-2" />
                  <h3 className="font-medium mb-1">Cultural Rooms</h3>
                  <p className="text-sm text-gray-400">Connect with Africa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="relative space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-4xl font-bold mb-4">
                Experience the Spirit of
                <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                  African Connection
                </span>
              </h3>
              <p className="text-xl text-gray-400">
                Join our vibrant community and connect with people who share your passion for African culture
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-6">
              {[
                {
                  icon: FaComments,
                  title: 'Cultural Chat Rooms',
                  description: 'Engage in themed spaces inspired by African landmarks and traditions'
                },
                {
                  icon: FaUsers,
                  title: 'Vibrant Community',
                  description: 'Connect with people from all corners of Africa and beyond'
                },
                {
                  icon: FaGlobe,
                  title: 'African Languages',
                  description: 'Chat in multiple African languages with real-time translation support'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:bg-orange-500/5 transition-colors duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-3">
                      <feature.icon className="text-2xl text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
