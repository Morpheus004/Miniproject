import React, { useState, useRef, useEffect } from 'react';
import { Settings, Trash2, UserMinus } from 'lucide-react';
import { Button } from '../../ui/buttons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import axios from 'axios';
import { BACKEND_URL } from '../../../config';

const ChatSettingsMenu = ({ 
  selectedConversation, 
  currentUserId, 
  onFriendRemoved,
  onConversationCleared 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showRemoveFriendDialog, setShowRemoveFriendDialog] = useState(false);
  const [showClearChatDialog, setShowClearChatDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRemoveFriend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First delete the conversation
      const clearChatResponse = await axios.delete(BACKEND_URL+'/chat/conversation', {
        data: {
          userId: currentUserId,
          friendId: selectedConversation.id
        }
      });

      if (!clearChatResponse.data.success) {
        throw new Error('Failed to clear conversation');
      }

      // Then remove the friend relationship
      const removeFriendResponse = await axios.delete(BACKEND_URL+'/friends/remove', {
        data: {
          userId: currentUserId,
          friendId: selectedConversation.id
        }
      });

      if (!removeFriendResponse.data.success) {
        throw new Error('Failed to remove friend');
      }

      setShowRemoveFriendDialog(false);
      onFriendRemoved();
    } catch (error) {
      console.error('Error removing friend:', error);
      setError(error.response?.data?.error || 'Failed to remove friend');
      // Revert UI if operation failed
      onFriendRemoved(true); // Pass true to indicate operation failed
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Construct the conversation ID in the custom format
      const user1Id = currentUserId;
      const user2Id = selectedConversation.id;
      
      const conversationId = `conv_${user1Id}_${user2Id}`;
      console.log(conversationId);
      const response = await axios.delete(BACKEND_URL+'/chat/messages', {
        data: {
          conversationId
        }
      });

      if (!response.data.success) {
        throw new Error('Failed to clear chat');
      }

      setShowClearChatDialog(false);
      onConversationCleared();
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError(error.response?.data?.error || 'Failed to clear chat');
      onConversationCleared(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedConversation || !currentUserId) {
    return null;
  }

  return (
    <div className="relative">
      <Button 
        ref={buttonRef}
        variant="ghost" 
        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setShowMenu(!showMenu)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
              onClick={() => {
                setShowMenu(false);
                setShowRemoveFriendDialog(true);
              }}
              disabled={isLoading}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Remove Friend
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => {
                setShowMenu(false);
                setShowClearChatDialog(true);
              }}
              disabled={isLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Conversation
            </button>
          </div>
        </div>
      )}

      <AlertDialog open={showRemoveFriendDialog} onOpenChange={setShowRemoveFriendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedConversation?.name} from your friends list and delete all conversation history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRemoveFriend}
              disabled={isLoading}
            >
              {isLoading ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearChatDialog} onOpenChange={setShowClearChatDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all messages in this conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleClearChat}
              disabled={isLoading}
            >
              {isLoading ? 'Clearing...' : 'Clear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-100 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ChatSettingsMenu;