import { useSocketContext } from '../context/SocketContext';
import type { Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  const { socket } = useSocketContext();
  return socket;
};
