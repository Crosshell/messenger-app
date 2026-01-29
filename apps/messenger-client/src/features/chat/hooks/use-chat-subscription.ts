import { useEffect } from 'react';
import { useSocket } from '@shared/hooks/use-socket';
import type { Message } from '../model/types/message.type';
import { useChatCacheUpdaters } from './use-chat-cache-updaters';

export const useChatSubscription = (chatId: string) => {
  const socket = useSocket();
  const { addMessageToCache } = useChatCacheUpdaters();

  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit('joinChat', chatId);
    };

    joinRoom();
    socket.on('connect', joinRoom);

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chatId !== chatId) return;
      addMessageToCache(chatId, newMessage);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, chatId, addMessageToCache]);
};
