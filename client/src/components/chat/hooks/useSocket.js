// hooks/useSocket.js
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {BACKEND_URL} from '../../../config.js'

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(BACKEND_URL, {
            transports: ['websocket'],
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};