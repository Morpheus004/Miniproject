// FriendCard.jsx
import React from 'react';

const FriendCard = ({ friend }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-semibold"
      style={{ backgroundColor: `hsl(${friend.friend_name.charCodeAt(0) * 137.508} 70% 60%)` }}
    >
      {friend.friend_name[0].toUpperCase()}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900">{friend.friend_name}</h3>
      <p className="text-sm text-gray-500">{friend.friend_email}</p>
    </div>
  </div>
);

export default FriendCard;