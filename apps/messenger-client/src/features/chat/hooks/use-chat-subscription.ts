import { useEffect } from 'react';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@shared/hooks/use-socket.ts';
import type { Message } from '../model/types/message.type.ts';

export const useChatSubscription = (chatId: string) => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit('joinChat', chatId);
    };

    joinRoom();

    socket.on('connect', joinRoom);

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
          if (newPages[0].some((msg) => msg.id === newMessage.id)) {
            return oldData;
          }

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
      socket.off('connect', joinRoom);
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatId, queryClient]);
};
