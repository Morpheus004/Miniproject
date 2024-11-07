// FriendsContent.jsx
import React from 'react';
import RequestCard from './RequestCard';
import FriendCard from './FriendCard';

const FriendsContent = ({ activeTab, isLoading, requests, friends, onAccept, onReject }) => (
  <div className="flex-1 overflow-y-auto p-4">
    {activeTab === 'requests' && (
      <>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No pending requests</div>
        ) : (
          requests.map((request) => (
            <RequestCard 
              key={request.sender_id} 
              request={request} 
              onAccept={onAccept}
              onReject={onReject}
            />
          ))
        )}
      </>
    )}

    {activeTab === 'friends' && (
      <>
        {friends.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No friends yet</div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <FriendCard key={friend.friend_id} friend={friend} />
            ))}
          </div>
        )}
      </>
    )}
  </div>
);

export default FriendsContent;