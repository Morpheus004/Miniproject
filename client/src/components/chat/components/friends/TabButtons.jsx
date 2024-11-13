// TabButtons.jsx
import React from 'react';
import { UserPlus, Users } from 'lucide-react';

const TabButtons = ({ activeTab, setActiveTab, requestCount }) => (
  <div className="flex border-b bg-gray-50 p-2 gap-2">
    <button
      onClick={() => setActiveTab('requests')}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
        ${activeTab === 'requests' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      <UserPlus className="w-4 h-4" />
      Requests {requestCount > 0 && `(${requestCount})`}
    </button>
    <button
      onClick={() => setActiveTab('friends')}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
        ${activeTab === 'friends' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      <Users className="w-4 h-4" />
      Friends
    </button>
  </div>
);

export default TabButtons;