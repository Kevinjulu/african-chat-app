import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaComments, FaGlobe, FaUsers, FaPalette, FaArrowRight, FaDrum, FaHeart } from 'react-icons/fa';
import Login from '../auth/Login.jsx';

const WelcomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/patterns/adinkra.svg')] bg-repeat animate-slide-slow"></div>
      </div>

      {showLogin ? (
        <Login />
      ) : (
        <div className="relative z-10">
          {/* Navigation */}
          <nav className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-orange-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <FaDrum className="text-3xl text-orange-500 animate-bounce" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                    AfriChat
                  </span>
                </div>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-6 py-2 text-sm font-medium text-orange-500 border border-orange-500/50 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Join Now
                </button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Left Column */}
              <div className="text-center lg:text-left space-y-8">
                <h1 className="text-5xl lg:text-7xl font-bold">
                  <span className="block mb-2">Connect with</span>
                  <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                    African Spirit
                  </span>
                </h1>
                <p className="text-xl text-gray-300">
                  Experience real-time conversations infused with the richness of African culture. 
                  Join themed chat rooms inspired by the continent's diverse heritage.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-lg font-medium hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Get Started
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button className="px-8 py-4 border-2 border-orange-500/50 rounded-full text-lg font-medium hover:bg-orange-500/10 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Right Column - Interactive Visual */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-3xl p-8 backdrop-blur-xl border border-orange-500/20">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: FaDrum, label: 'Cultural Rooms' },
                      { icon: FaGlobe, label: 'African Languages' },
                      { icon: FaUsers, label: 'Community' },
                      { icon: FaHeart, label: 'Connect' }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="group p-6 bg-black/20 rounded-2xl hover:bg-orange-500/20 transition-all duration-300 cursor-pointer"
                      >
                        <item.icon className="text-4xl text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="relative z-10 bg-black/40 backdrop-blur-xl py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text inline-block">
                  Experience the Magic
                </h2>
                <p className="mt-4 text-xl text-gray-300">
                  Discover a new way to connect with African culture
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: FaComments,
                    title: 'Cultural Chat Rooms',
                    description: 'Themed spaces inspired by African landmarks and traditions'
                  },
                  {
                    icon: FaGlobe,
                    title: 'Language Support',
                    description: 'Chat in multiple African languages with real-time translation'
                  },
                  {
                    icon: FaUsers,
                    title: 'Vibrant Community',
                    description: 'Connect with people who share your passion for African culture'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group relative p-8 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-yellow-500/0 group-hover:from-orange-500/10 group-hover:to-yellow-500/10 rounded-2xl transition-all duration-300"></div>
                    <feature.icon className="text-4xl text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/20">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[url('/patterns/adinkra.svg')] bg-repeat opacity-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
                </div>
                <div className="relative px-8 py-16 text-center">
                  <h2 className="text-4xl font-bold mb-6">
                    Ready to Experience African Culture?
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Join our community today and start connecting with people who share your passion for African heritage
                  </p>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-lg font-medium hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Join Now
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
