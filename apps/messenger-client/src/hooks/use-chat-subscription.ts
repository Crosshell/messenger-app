import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import type { Message } from '../types/message.type';

export const useChatSubscription = (chatId: string) => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinChat', chatId);

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chatId !== chatId) return;

      queryClient.setQueryData<Message[]>(['messages', chatId], (oldData) => {
        if (!oldData) return [newMessage];
        if (oldData.find((m) => m.id === newMessage.id)) return oldData;
        return [...oldData, newMessage];
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatId, queryClient]);
};
