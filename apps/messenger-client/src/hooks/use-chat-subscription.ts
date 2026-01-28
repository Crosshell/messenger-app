import { useEffect } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
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

      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', chatId],
        (oldData) => {
          if (!oldData || oldData.pages.length === 0) {
            return {
              pages: [[newMessage]],
              pageParams: [undefined],
            };
          }

          const newPages = [...oldData.pages];

          newPages[0] = [newMessage, ...newPages[0]];

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatId, queryClient]);
};
