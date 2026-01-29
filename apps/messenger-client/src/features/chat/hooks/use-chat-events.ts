import { useEffect } from 'react';
import { useSocket } from '@shared/hooks/use-socket';
import { useChatStore } from '../model/chat.store';
import type { Message } from '../model/types/message.type';
import type { MessagesReadResponse } from '../model/types/responses/messages-read.response';
import type { MessageDeletedResponse } from '../model/types/responses/message-deleted.response';
import { useChatCacheUpdaters } from './use-chat-cache-updaters';

export const useChatEvents = () => {
  const socket = useSocket();
  const activeChatId = useChatStore((state) => state.activeChatId);

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
  }, [
    socket,
    activeChatId,
    markMessagesAsReadInCache,
    updateMessageInCache,
    removeMessageFromCache,
    invalidateChatsList,
  ]);
};
