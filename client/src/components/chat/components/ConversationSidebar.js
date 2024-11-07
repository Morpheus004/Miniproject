import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../ui/buttons';
import { useSocket } from '../hooks/useSocket';
import NewConversationDialog from './NewConversationDialog';

const ConversationSidebar = ({ setSelectedConversation, currentUserId }) => {
    const [conversations, setConversations] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        fetchConversations();
        
        if (socket) {
            socket.emit('join', currentUserId);
            
            socket.on('new_message', (message) => {
                // Update conversation list to show new message
                fetchConversations();
            });
        }
        
        return () => {
            if (socket) {
                socket.off('new_message');
            }
        };
    }, [currentUserId, socket]);

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get(`http://localhost:9000/chat/conversations/${currentUserId}`);
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-80 bg-gray-50 border-r flex flex-col h-full">
            <div className="w-90 bg-white border p-4 flex justify-between items-center border-b border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold">Conversations</h2>
                <NewConversationDialog currentUserId={currentUserId} setSelectedConversation={setSelectedConversation} />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {conversations.map((conv) => (
                    <div
                        key={conv.conversation_id}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-blue-50
                            ${conv.unread_count > 0 ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedConversation({
                            id: conv.other_user_id,
                            name: conv.other_user_name
                        })}
                    >
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            {conv.other_user_name[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="font-medium">{conv.other_user_name}</p>
                                <span className="text-xs text-gray-500">
                                {formatTime(conv.last_message_time)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                            {conv.unread_count > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 float-right">
                                    {conv.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationSidebar;