import React, { useState } from 'react';
import { ChevronDown, LogOut, User, Settings } from 'lucide-react';

const ProfileSection = ({ userInfo, onLogOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const firstLetter = userInfo?.fullName?.charAt(0)?.toUpperCase() || '@';
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-full pr-4 pl-1 py-1 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-semibold">
          {firstLetter}
        </div>
        <span className="text-white font-medium">{userInfo?.fullName || 'Ajju'}</span>
        <ChevronDown 
          size={16} 
          className={`text-white transition-transform duration-300 ${
            isDropdownOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
          <button 
            className="w-full px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center space-x-2"
            onClick={() => {/* Handle profile click */}}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button 
            className="w-full px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center space-x-2"
            onClick={() => {/* Handle settings click */}}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <hr className="my-1" />
          <button 
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
            onClick={onLogOut}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;