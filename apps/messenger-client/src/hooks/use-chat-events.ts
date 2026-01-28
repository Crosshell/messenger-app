import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useAuthStore } from '../store/auth.store';
import { useChatStore } from '../store/chat.store';
import type { Message } from '../types/message.type';
import type { Chat } from '../types/chat.type';
import type { MessagesReadResponse } from '../types/responses/messages-read.response.ts';
import {
  updateChatListOnNewMessage,
  updateChatListReadStatus,
  updateMessagesOnRead,
} from '../utils/chat-cache-updaters';

export const useChatEvents = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.userId);
  const activeChatId = useChatStore((state) => state.activeChatId);

  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = (newMessage: Message) => {
      queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
        const updated = updateChatListOnNewMessage(
          oldChats,
          newMessage,
          currentUserId,
          activeChatId,
        );

        if (updated === undefined && oldChats) {
          queryClient.invalidateQueries({ queryKey: ['chats'] });
          return oldChats;
        }

        return updated;
      });
    };

    const handleMessagesRead = ({
      chatId,
      readAt,
      readerId,
    }: MessagesReadResponse) => {
      const readUntilTimestamp = new Date(readAt).getTime();
      if (isNaN(readUntilTimestamp)) return;

      queryClient.setQueryData<Message[]>(['messages', chatId], (oldMessages) =>
        updateMessagesOnRead(oldMessages, readUntilTimestamp),
      );

      queryClient.setQueryData<Chat[]>(['chats'], (oldChats) =>
        updateChatListReadStatus(oldChats, {
          chatId,
          readerId,
          currentUserId,
          readUntilTimestamp,
        }),
      );
    };

    socket.on('chatListUpdate', handleChatListUpdate);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('chatListUpdate', handleChatListUpdate);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, queryClient, currentUserId, activeChatId]);
};
