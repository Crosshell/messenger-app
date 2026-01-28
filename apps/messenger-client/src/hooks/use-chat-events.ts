import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useAuthStore } from '../store/auth.store';
import { useChatStore } from '../store/chat.store';
import type { Message } from '../types/message.type';
import type { Chat } from '../types/chat.type';
import type { MessagesReadResponse } from '../types/responses/messages-read.response.ts';

export const useChatEvents = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.userId);
  const activeChatId = useChatStore((state) => state.activeChatId);

  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = (newMessage: Message) => {
      queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
        if (!oldChats) return oldChats;

        const newChats = [...oldChats];
        const chatIndex = newChats.findIndex((c) => c.id === newMessage.chatId);

        if (chatIndex === -1) {
          queryClient.invalidateQueries({ queryKey: ['chats'] });
          return oldChats;
        }

        const [chatToMove] = newChats.splice(chatIndex, 1);
        const isMe = newMessage.senderId === currentUserId;

        const shouldIncrement = !isMe && activeChatId !== newMessage.chatId;

        const updatedChat: Chat = {
          ...chatToMove,
          lastMessageAt: newMessage.createdAt,
          messages: [newMessage],
          unreadCount: shouldIncrement
            ? (chatToMove.unreadCount || 0) + 1
            : chatToMove.unreadCount,
        };

        newChats.unshift(updatedChat);
        return newChats;
      });
    };

    const handleMessagesRead = ({
      chatId,
      readAt,
      readerId,
    }: MessagesReadResponse) => {
      const readUntilTimestamp = new Date(readAt).getTime();
      if (isNaN(readUntilTimestamp)) return;

      queryClient.setQueryData<Message[]>(
        ['messages', chatId],
        (oldMessages) => {
          if (!oldMessages) return oldMessages;

          return oldMessages.map((msg) => {
            if (msg.isRead) return msg;

            const msgTimestamp = new Date(msg.createdAt).getTime();

            if (msgTimestamp <= readUntilTimestamp + 1000) {
              return { ...msg, isRead: true };
            }

            return msg;
          });
        },
      );

      queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
        if (!oldChats) return oldChats;

        return oldChats.map((chat) => {
          if (chat.id !== chatId) return chat;

          if (readerId === currentUserId) {
            return { ...chat, unreadCount: 0 };
          }

          if (chat.messages && chat.messages.length > 0) {
            const lastMsg = chat.messages[0];
            const msgDate = new Date(lastMsg.createdAt);

            if (
              lastMsg.senderId === currentUserId &&
              !lastMsg.isRead &&
              msgDate.getTime() <= readUntilTimestamp + 1000
            ) {
              return {
                ...chat,
                messages: [{ ...lastMsg, isRead: true }],
              };
            }
          }

          return chat;
        });
      });
    };

    socket.on('chatListUpdate', handleChatListUpdate);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('chatListUpdate', handleChatListUpdate);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, queryClient, currentUserId, activeChatId]);
};
