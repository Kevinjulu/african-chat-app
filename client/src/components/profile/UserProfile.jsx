import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaPalette, FaGlobe, FaCamera, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AFRICAN_THEMES = [
  { id: 'serengeti', name: 'Serengeti Sunset', colors: ['from-orange-500', 'to-amber-500'] },
  { id: 'sahara', name: 'Sahara Dawn', colors: ['from-amber-400', 'to-orange-300'] },
  { id: 'nile', name: 'Nile Waters', colors: ['from-blue-500', 'to-teal-400'] },
  { id: 'kilimanjaro', name: 'Kilimanjaro Snow', colors: ['from-blue-100', 'to-gray-200'] },
  { id: 'savanna', name: 'Savanna Gold', colors: ['from-yellow-400', 'to-amber-500'] },
];

const AFRICAN_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'am', name: 'Amharic' },
];

const UserProfile = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'serengeti');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = () => {
    updateProfile({
      avatar,
      theme: selectedTheme,
      language,
      bio,
    });
    toast.success('Profile updated successfully! 🌟');
    onClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-orange-500" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <FaCamera />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="opacity-90">Edit Your Profile</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">About Me</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows="3"
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaPalette className="mr-2" />
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {AFRICAN_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-lg bg-gradient-to-r ${theme.colors.join(' ')} text-white text-left transition-transform ${
                    selectedTheme === theme.id ? 'ring-2 ring-offset-2 ring-orange-500 scale-105' : 'hover:scale-105'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaGlobe className="mr-2" />
              Preferred Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {AFRICAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors flex items-center space-x-2"
          >
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
