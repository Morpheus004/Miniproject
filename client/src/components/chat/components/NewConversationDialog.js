import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../ui/buttons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { useToast } from '../../ui/toast';
import { Search } from 'lucide-react';
import { Input } from '../../ui/input';
import { Plus } from 'lucide-react';
import {BACKEND_URL} from '../../../config.js'

const NewConversationDialog = ({ currentUserId, setSelectedConversation }) => {
    const [open, setOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            fetchFriends();
        }
    }, [open, currentUserId]);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${BACKEND_URL}/friends/list/${currentUserId}`);
            setFriends(data);
        } catch (err) {
            setError('Failed to fetch friends list');
            toast({
                title: "Error",
                description: "Could not load friends list",
                variant: "destructive",
                duration: 3000,
            });
        }
        setIsLoading(false);
    };

    const handleSelectFriend = (friend) => {
        setSelectedConversation({
            id: friend.friend_id,
            name: friend.friend_name
        });
        setOpen(false);
    };

    const filteredFriends = friends.filter(friend =>
        friend.friend_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.friend_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 bg-gray-100 rounded-md"
                onClick={() => setOpen(true)}
            >
                <Plus className="h-5 w-5" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>New Conversation</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search friends..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {isLoading ? (
                                <div className="text-center py-4 text-gray-500">Loading...</div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    {searchQuery ? 'No matching friends found' : 'No friends yet'}
                                </div>
                            ) : (
                                filteredFriends.map((friend) => (
                                    <div
                                        key={friend.friend_id}
                                        onClick={() => handleSelectFriend(friend)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                                            style={{ backgroundColor: `hsl(${friend.friend_name.charCodeAt(0) * 137.508} 70% 60%)` }}
                                        >
                                            {friend.friend_name[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {friend.friend_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {friend.friend_email}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NewConversationDialog;