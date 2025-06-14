import { Bell, Settings, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = (e) => {
    e.stopPropagation();
    setShowPopup(prev => !prev);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showPopup) setShowPopup(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPopup]);

  return (
    <header className="bg-white border-b border-gray-200 h-16 relative z-50">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex-1" />
        <div className="flex items-center space-x-4 relative">
          {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button> */}
          {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button> */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
            onClick={togglePopup}
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>

          {showPopup && (
            <div 
              className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* <button className="block w-full text-left text-sm text-gray-700 py-2 px-4 hover:bg-gray-100 rounded-lg">
                Profile
              </button> */}
              <button className="block w-full text-left text-sm text-gray-700 py-2 px-4 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}