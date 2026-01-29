import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const useSocket = () => {
  const { accessToken } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const newSocket = io(BASE_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
      autoConnect: true,
      reconnection: false,
      forceNew: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken]);

  return socket;
};
