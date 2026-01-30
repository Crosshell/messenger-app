import { useEffect } from 'react';
import { useSocket } from '@shared/hooks/use-socket';
import { useChatStore } from '../model/chat.store';
import type { Message } from '../model/types/message.type';
import type { MessagesReadResponse } from '../model/types/responses/messages-read.response';
import type { MessageDeletedResponse } from '../model/types/responses/message-deleted.response';
import { useChatCacheUpdaters } from './use-chat-cache-updaters';
import { queryClient } from '@lib/query-client';

export const useChatEvents = () => {
  const socket = useSocket();
  const { activeChatId, setActiveChatId } = useChatStore();

  const {
    markMessagesAsReadInCache,
    updateMessageInCache,
    removeMessageFromCache,
    invalidateChatsList,
  } = useChatCacheUpdaters();

  useEffect(() => {
    if (!socket) return;

    const handleChatListUpdate = () => invalidateChatsList();

    const handleMessagesRead = ({ chatId, readAt }: MessagesReadResponse) => {
      markMessagesAsReadInCache(chatId, readAt);
    };

    const handleMessageUpdated = (updatedMessage: Message) => {
      updateMessageInCache(updatedMessage);
    };

    const handleMessageDeleted = (payload: MessageDeletedResponse) => {
      if (activeChatId === payload.chatId) {
        removeMessageFromCache(payload.chatId, payload.messageId);
      } else {
        invalidateChatsList();
      }
    };

    const handleChatDeleted = ({ chatId }: { chatId: string }) => {
      invalidateChatsList();

      if (activeChatId === chatId) {
        setActiveChatId(null);
        queryClient.removeQueries({ queryKey: ['messages', chatId] });
      }
    };

    socket.on('exception', (error) =>
      console.error('Socket Exception:', error),
    );
    socket.on('chatListUpdate', handleChatListUpdate);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('messageUpdated', handleMessageUpdated);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('chatDeleted', handleChatDeleted);

    return () => {
      socket.off('chatListUpdate', handleChatListUpdate);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('messageUpdated', handleMessageUpdated);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('chatDeleted', handleChatDeleted);
    };
  }, [
    socket,
    activeChatId,
    markMessagesAsReadInCache,
    updateMessageInCache,
    removeMessageFromCache,
    invalidateChatsList,
  ]);
};
