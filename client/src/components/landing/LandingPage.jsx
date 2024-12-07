import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiUsers, FiGlobe } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/patterns/adinkra.svg')] bg-repeat animate-slide-slow"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-orange-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <FiMessageCircle className="text-3xl text-orange-500 animate-bounce" />
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-transparent bg-clip-text">
                  AfriChat
                </span>
              </div>
              <div className="space-x-4">
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium text-orange-500 border border-orange-500/50 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 text-sm font-medium text-orange-500 border border-orange-500/50 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Welcome to AfriChat
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Experience real-time conversations with an African touch
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-purple-600/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600/30 transition-colors duration-300 border-2 border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <div className="text-white mb-4">
                <FiMessageCircle size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-Time Chat</h3>
              <p className="text-white/80">
                Instant messaging with emoji support, file sharing, and voice messages
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <div className="text-white mb-4">
                <FiUsers size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Chat Rooms</h3>
              <p className="text-white/80">
                Join different rooms to connect with people sharing similar interests
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <div className="text-white mb-4">
                <FiGlobe size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">African Culture</h3>
              <p className="text-white/80">
                Experience the richness of African design and cultural elements
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white/10 backdrop-blur-lg p-12 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Connect with people from all over Africa and beyond
            </p>
            <Link
              to="/register"
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              Join AfriChat Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
