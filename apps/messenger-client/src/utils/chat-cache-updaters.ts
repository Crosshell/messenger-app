import type { Chat } from '../types/chat.type';
import type { Message } from '../types/message.type';

interface UpdateReadStatusParams {
  chatId: string;
  readerId: string;
  currentUserId: string | null;
  readUntilTimestamp: number;
}

export const updateChatListOnNewMessage = (
  oldChats: Chat[] | undefined,
  newMessage: Message,
  currentUserId: string | null,
  activeChatId: string | null,
): Chat[] | undefined => {
  if (!oldChats) return oldChats;

  const newChats = [...oldChats];
  const chatIndex = newChats.findIndex((c) => c.id === newMessage.chatId);

  if (chatIndex === -1) return undefined;

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
};

export const updateMessagesOnRead = (
  oldMessages: Message[] | undefined,
  readUntilTimestamp: number,
): Message[] | undefined => {
  if (!oldMessages) return oldMessages;

  return oldMessages.map((msg) => {
    if (msg.isRead) return msg;
    const msgTimestamp = new Date(msg.createdAt).getTime();
    if (msgTimestamp <= readUntilTimestamp + 1000) {
      return { ...msg, isRead: true };
    }
    return msg;
  });
};

export const updateChatListReadStatus = (
  oldChats: Chat[] | undefined,
  {
    chatId,
    readerId,
    currentUserId,
    readUntilTimestamp,
  }: UpdateReadStatusParams,
): Chat[] | undefined => {
  if (!oldChats) return oldChats;

  return oldChats.map((chat) => {
    if (chat.id !== chatId) return chat;

    if (readerId === currentUserId) {
      return { ...chat, unreadCount: 0 };
    }

    if (chat.messages && chat.messages.length > 0) {
      const lastMsg = chat.messages[0];
      const msgDate = new Date(lastMsg.createdAt).getTime();

      if (
        lastMsg.senderId === currentUserId &&
        !lastMsg.isRead &&
        msgDate <= readUntilTimestamp + 1000
      ) {
        return {
          ...chat,
          messages: [{ ...lastMsg, isRead: true }],
        };
      }
    }

    return chat;
  });
};
