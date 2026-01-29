import { useEffect } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useChatStore } from '../store/chat.store';
import type { Message } from '../types/message.type';
import type { MessagesReadResponse } from '../types/responses/messages-read.response';
import type { MessageDeletedResponse } from '../types/responses/message-deleted.response';
import {
  updateMessagesOnRead,
  updateMessageOnEdit,
  removeMessageOnDelete,
} from '../utils/chat-cache-updaters';

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
