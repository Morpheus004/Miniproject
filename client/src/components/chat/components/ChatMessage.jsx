import React from 'react';

const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message, currentUserId,currentUserName, isLastInGroup = false, sender }) => {
    const isOwnMessage = message.sender_id === currentUserId;

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 relative`}>
            <div className={`flex items-end ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar shows for both sent and received messages when isLastInGroup */}
                <div className="w-8 flex-shrink-0">
                    {isLastInGroup && (
                        <div className={`w-8 h-8 rounded-full ${isOwnMessage ? 'bg-blue-500' : 'bg-purple-500'} flex items-center justify-center text-white text-sm mb-1`}>
                            {isOwnMessage ? currentUserName[0]?.toUpperCase() : sender?.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
                
                {/* Message content with consistent spacing */}
                <div className={`mx-2 max-w-[70%]`}>
                    <div className={`${
                        isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    } rounded-lg px-4 py-2`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                            {formatTime(message.sent_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;