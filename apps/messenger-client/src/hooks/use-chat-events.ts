import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useAuthStore } from '../store/auth.store';
import { useChatStore } from '../store/chat.store';
import type { Message } from '../types/message.type';
import type { Chat } from '../types/chat.type';
import type { MessagesReadResponse } from '../types/responses/messages-read.response';
import {
  updateChatListOnNewMessage,
  updateChatListReadStatus,
  updateMessagesOnRead,
  updateMessageOnEdit,
  removeMessageOnDelete,
  updateChatListOnEdit,
  updateUnreadCountOnDelete,
  shouldRefetchChatsOnDelete,
} from '../utils/chat-cache-updaters';
import type { MessageDeletedResponse } from '../types/responses/message-deleted.response.ts';

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

      queryClient.setQueryData<Message[]>(['messages', chatId], (old) =>
        updateMessagesOnRead(old, readUntilTimestamp),
      );

      queryClient.setQueryData<Chat[]>(['chats'], (old) =>
        updateChatListReadStatus(old, {
          chatId,
          readerId,
          currentUserId,
          readUntilTimestamp,
        }),
      );
    };

    const handleMessageUpdated = (updatedMessage: Message) => {
      queryClient.setQueryData<Message[]>(
        ['messages', updatedMessage.chatId],
        (old) => updateMessageOnEdit(old, updatedMessage),
      );

      queryClient.setQueryData<Chat[]>(['chats'], (old) =>
        updateChatListOnEdit(old, updatedMessage),
      );
    };

    const handleMessageDeleted = (payload: MessageDeletedResponse) => {
      if (activeChatId === payload.chatId) {
        queryClient.setQueryData<Message[]>(
          ['messages', payload.chatId],
          (old) => removeMessageOnDelete(old, payload.messageId),
        );
      }

      queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
        const chatsWithUpdatedCount = updateUnreadCountOnDelete(
          oldChats,
          payload,
          currentUserId,
        );

        if (
          shouldRefetchChatsOnDelete(chatsWithUpdatedCount, payload.messageId)
        ) {
          queryClient.invalidateQueries({ queryKey: ['chats'] });
          return chatsWithUpdatedCount;
        }

        return chatsWithUpdatedCount;
      });
    };

    socket.on('chatListUpdate', handleChatListUpdate);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('messageUpdated', handleMessageUpdated);
    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('chatListUpdate', handleChatListUpdate);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('messageUpdated', handleMessageUpdated);
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [socket, queryClient, currentUserId, activeChatId]);
};
