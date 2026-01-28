import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

const BASE_API_URL = import.meta.env.VITE_API_URL;

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [socket, setSocket] = useState<Socket | null>(socketInstance);

  useEffect(() => {
    if (!accessToken) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        setSocket(null);
      }
      return;
    }

    if (socketInstance) {
      setSocket(socketInstance);
      return;
    }

    const newSocket = io(BASE_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
    });

    socketInstance = newSocket;
    setSocket(newSocket);
  }, [accessToken]);

  return socket;
};
