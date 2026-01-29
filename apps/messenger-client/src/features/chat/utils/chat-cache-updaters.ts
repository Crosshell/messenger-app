import type { Message } from '../model/types/message.type.ts';
import type { InfiniteData } from '@tanstack/react-query';

export const updateMessagesOnRead = (
  oldData: InfiniteData<Message[]> | undefined,
  readUntilTimestamp: number,
): InfiniteData<Message[]> | undefined => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) =>
      page.map((msg) => {
        if (msg.isRead) return msg;
        const msgTimestamp = new Date(msg.createdAt).getTime();
        if (msgTimestamp <= readUntilTimestamp + 1000) {
          return { ...msg, isRead: true };
        }
        return msg;
      }),
    ),
  };
};

export const updateMessageOnEdit = (
  oldData: InfiniteData<Message[]> | undefined,
  updatedMessage: Message,
): InfiniteData<Message[]> | undefined => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) =>
      page.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)),
    ),
  };
};

export const removeMessageOnDelete = (
  oldData: InfiniteData<Message[]> | undefined,
  messageId: string,
): InfiniteData<Message[]> | undefined => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) =>
      page.filter((msg) => msg.id !== messageId),
    ),
  };
};
