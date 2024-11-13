import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../../ui/toast';
import { useRouteLoaderData } from 'react-router-dom';
import AddFriendDialog from './AddFriendDialog';
import TabButtons from './TabButtons';
import FriendsContent from './FriendsContent';
import {BACKEND_URL} from '../../../../config.js'

const FriendRequestsSidebar = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const userInfoStudent = useRouteLoaderData('studentData');
  const userInfoAlumni = useRouteLoaderData('alumniData');
  
  const isStudent = userInfoStudent?.data?.role === 'student';
  const isAlumni = userInfoAlumni?.data?.role === 'alumni';
  
  const currentUserId = isStudent ? userInfoStudent?.data?.uid : 
                       isAlumni ? userInfoAlumni?.data?.uid : '';

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/friends/requests/${currentUserId}`);
      const incomingRequests = data.filter(req => req.receiver_id === currentUserId);
      setRequests(incomingRequests);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch friend requests",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/friends/list/${currentUserId}`);
      setFriends(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch friends list",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchRequests();
      fetchFriends();
    }
  }, [currentUserId]);

  const handleAccept = async (senderId) => {
    await handleRequest(senderId, 'accept');
  };

  const handleReject = async (senderId) => {
    await handleRequest(senderId, 'reject');
  };

  const handleRequest = async (senderId, action) => {
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      await axios.put(`${BACKEND_URL}/friends/request/${senderId}/${currentUserId}`, {
        status
      });

      toast({
        title: "Success",
        description: `Friend request ${status}`,
        duration: 3000,
      });

      setRequests(requests.filter(req => req.sender_id !== senderId));
      if (status === 'accepted') {
        fetchFriends();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} friend request`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r flex flex-col h-full">
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">Friends</h2>
        <AddFriendDialog currentUserId={currentUserId} />
      </div>

      <TabButtons 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        requestCount={requests.length}
      />

      <FriendsContent
        activeTab={activeTab}
        isLoading={isLoading}
        requests={requests}
        friends={friends}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
};

export default FriendRequestsSidebar;