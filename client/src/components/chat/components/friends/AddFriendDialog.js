import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../../../ui/buttons';
import { UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Input } from '../../../ui/input';
import { Alert, AlertDescription } from '../../../ui/alert';
import { useToast } from '../../../ui/toast';

const AddFriendDialog = ({ currentUserId }) => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { toast } = useToast();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Email is required');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            // Check if user exists
            const { data: userData } = await axios.post('http://localhost:9000/friends/check-user', { 
                email 
            });

            if (!userData.exists) {
                setError('No user found with this email address');
                setIsLoading(false);
                return;
            }

            if (userData.uid === currentUserId) {
                setError('You cannot send a friend request to yourself');
                setIsLoading(false);
                return;
            }

            // Check if a friend request already exists
            const { data: requestData } = await axios.post('http://localhost:9000/friends/check-friend-request', {
                senderId: currentUserId,
                receiverId: userData.uid
            });

            if (requestData.exists) {
                if (requestData.status === 'pending') {
                    setError('A friend request has already been sent to this user');
                } else if (requestData.status === 'accepted') {
                    setError('You are already friends with this user');
                }
                setIsLoading(false);
                return;
            }

            // Send the friend request
            const { status } = await axios.post('http://localhost:9000/friends/send-friend-request', {
                senderId: currentUserId,
                receiverId: userData.uid
            });

            if (status === 201) {
                toast({
                    title: "Success!",
                    description: "Friend request sent successfully",
                    duration: 3000,
                });
                setEmail('');
                setOpen(false);
            } else {
                setError('Failed to send friend request. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        }

        setIsLoading(false);
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="p-2 bg-gray-100 rounded-md"
                onClick={() => setOpen(true)}
            >
                <UserPlus className="h-5 w-5" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add friend</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-sm text-gray-500">
                            Send a request to connect with your friends!
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">
                                Email
                            </label>
                            <Input
                                label="Email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <Button className="p-5 bg-blue-500 rounded-md" type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddFriendDialog;