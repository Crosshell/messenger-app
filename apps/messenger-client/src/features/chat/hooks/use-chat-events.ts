import { useEffect } from 'react';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@shared/hooks/use-socket.ts';
import { useChatStore } from '../model/chat.store.ts';
import type { Message } from '../model/types/message.type.ts';
import type { MessagesReadResponse } from '../model/types/responses/messages-read.response.ts';
import type { MessageDeletedResponse } from '../model/types/responses/message-deleted.response.ts';
import {
  removeMessageOnDelete,
  updateMessageOnEdit,
  updateMessagesOnRead,
} from '../utils/chat-cache-updaters.ts';

export const useChatEvents = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const activeChatId = useChatStore((state) => state.activeChatId);

  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    const handleMessagesRead = ({ chatId, readAt }: MessagesReadResponse) => {
      const readUntilTimestamp = new Date(readAt).getTime();
      if (isNaN(readUntilTimestamp)) return;

      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', chatId],
        (old) => updateMessagesOnRead(old, readUntilTimestamp),
      );

      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    const handleMessageUpdated = (updatedMessage: Message) => {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', updatedMessage.chatId],
        (old) => updateMessageOnEdit(old, updatedMessage),
      );

      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    const handleMessageDeleted = (payload: MessageDeletedResponse) => {
      if (activeChatId === payload.chatId) {
        queryClient.setQueryData<InfiniteData<Message[]>>(
          ['messages', payload.chatId],
          (old) => removeMessageOnDelete(old, payload.messageId),
        );
      }

      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    socket.on('exception', (error) =>
      console.error('Socket Exception:', error),
    );
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
  }, [socket, queryClient, activeChatId]);
};
