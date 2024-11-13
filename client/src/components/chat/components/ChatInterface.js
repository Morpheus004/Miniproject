// src/components/ChatInterface.js
import React, { useState,useEffect } from 'react';
import { Button } from '../../ui/buttons';
import { Input } from '../../ui/input';
import { MessageCircle, Phone, Video, Settings, Plus, Send, Users } from 'lucide-react';
import ConversationSidebar from './ConversationSidebar';
import FriendRequestsSidebar from './friends/FriendRequestsSidebar';
import axios from 'axios';
import { useRouteLoaderData } from "react-router-dom";
import { useSocket } from '../hooks/useSocket';
import  ChatMessage  from './ChatMessage';
import ChatSettingsMenu from './ChatSettingsMenu';
import './chat.css';
import {BACKEND_URL} from '../../../config.js'

const ChatInterface = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showFriends, setShowFriends] = useState(false);
    const socket = useSocket();

    const userInfoStudent = useRouteLoaderData('studentData');
    const userInfoAlumni = useRouteLoaderData('alumniData');
  
    const isStudent = userInfoStudent?.data?.role === 'student';
    const isAlumni = userInfoAlumni?.data?.role === 'alumni';
  
    const currentUserId = isStudent ? userInfoStudent?.data?.uid : 
                          isAlumni ? userInfoAlumni?.data?.uid : '';
    
    const currentUserName = isStudent ? userInfoStudent?.data?.username : 
                          isAlumni ? userInfoAlumni?.data?.username : '';                      
    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
        }
        
        if (socket) {
            socket.on('new_message', (message) => {
                if (message.conversation_id === selectedConversation?.conversation_id) {
                    setMessages(prev => [...prev, message]);
                }
            });
        }
        
        return () => {
            if (socket) {
                socket.off('new_message');
            }
        };
    }, [selectedConversation, socket]);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get(
                `${BACKEND_URL}/chat/messages/${currentUserId}/${selectedConversation.id}`
            );
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && selectedConversation) {
            try {
                await axios.post(BACKEND_URL+'/chat/message', {
                    senderId: currentUserId,
                    receiverId: selectedConversation.id,
                    content: message.trim()
                });
                
                setMessage('');
                fetchMessages(); // Refetch messages to include the new one
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };
  return (
    <div className='page-container'>
      <div className="flex h-[calc(100vh-90px)] bg-gray-100 pt-10 pb-4">
        <div className="flex h-full w-full px-3">
          <div className="w-16 bg-white border border-gray-200 rounded-lg flex flex-col items-center py-4 mr-3 justify-between">
            <div className="space-y-4 pl-3">
              <Button
                variant="ghost"
                onClick={() => setShowFriends(false)}
                className={`p-2 ${!showFriends ? 'bg-blue-100' : 'bg-gray-100'} rounded-md`}
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowFriends(true)}
                className={`p-2 ${showFriends ? 'bg-blue-100' : 'bg-gray-100'} rounded-md`}
              >
                <Users className="h-6 w-6" />
              </Button>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
            {currentUserName[0].toUpperCase()}
            </div>
          </div>

          {showFriends ? (
            <FriendRequestsSidebar />
          ) : (
            <ConversationSidebar setSelectedConversation={setSelectedConversation} currentUserId={currentUserId}/>
          )}

          <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col mr-3">
            {selectedConversation ? (
              <>
                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                      {selectedConversation.name[0].toUpperCase()}
                    </div>
                    <h3 className="text-lg font-semibold">{selectedConversation.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    {/* <Button variant="ghost" size="icon" className="p-2 bg-gray-100 rounded-md">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="p-2 bg-gray-100 rounded-md">
                      <Video className="h-5 w-5" />
                    </Button> */}
                  <ChatSettingsMenu
                    selectedConversation={selectedConversation}
                    currentUserId={currentUserId}
                    onFriendRemoved={() => {
                      setSelectedConversation(null);
                      // Refresh the conversations list if you have a function for that
                    }}
                    onConversationCleared={() => {
                      setMessages([]);
                      // Optionally refresh the conversation
                    }}
                  />
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg,index) =>{
                  const isLastInGroup = 
                    index === messages.length - 1 || // Last message overall
                    messages[index + 1]?.sender_id !== msg.sender_id;
                
                return(
                <ChatMessage
                    key={msg.message_id}
                    message={msg}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                    isLastInGroup={isLastInGroup}
                    sender={selectedConversation}
                />
              );
            })}
                </div>
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-2">
                    {/* <Button variant="ghost" size="icon" className="p-2 bg-white rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button> */}
                    <Input
                      placeholder="Type a message..."
                      className="flex-1 border-0 bg-transparent focus:ring-0"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      className={`rounded-full p-2 ${message.trim() ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'}`}
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select/start a conversation to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

