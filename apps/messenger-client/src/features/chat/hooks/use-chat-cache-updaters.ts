import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { Message } from '../model/types/message.type';
import {
  removeMessageOnDelete,
  updateMessageOnEdit,
  updateMessagesOnRead,
} from '../utils/chat-cache-updaters';

export const useChatCacheUpdaters = () => {
  const queryClient = useQueryClient();

  const addMessageToCache = (chatId: string, newMessage: Message) => {
    queryClient.setQueryData<InfiniteData<Message[]>>(
      ['messages', chatId],
      (oldData) => {
        if (!oldData || oldData.pages.length === 0) {
          return {
            pages: [[newMessage]],
            pageParams: [undefined],
          };
        }

        if (oldData.pages[0].some((msg) => msg.id === newMessage.id)) {
          return oldData;
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

  const markMessagesAsReadInCache = (chatId: string, readAt: string) => {
    const readUntilTimestamp = new Date(readAt).getTime();
    if (isNaN(readUntilTimestamp)) return;

    queryClient.setQueryData<InfiniteData<Message[]>>(
      ['messages', chatId],
      (old) => updateMessagesOnRead(old, readUntilTimestamp),
    );
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  };

  const updateMessageInCache = (updatedMessage: Message) => {
    queryClient.setQueryData<InfiniteData<Message[]>>(
      ['messages', updatedMessage.chatId],
      (old) => updateMessageOnEdit(old, updatedMessage),
    );
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  };

  const removeMessageFromCache = (chatId: string, messageId: string) => {
    queryClient.setQueryData<InfiniteData<Message[]>>(
      ['messages', chatId],
      (old) => removeMessageOnDelete(old, messageId),
    );
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  };

  const invalidateChatsList = () => {
    queryClient.invalidateQueries({ queryKey: ['chats'] });
  };

  return {
    addMessageToCache,
    markMessagesAsReadInCache,
    updateMessageInCache,
    removeMessageFromCache,
    invalidateChatsList,
  };
};
