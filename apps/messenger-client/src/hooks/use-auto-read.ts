import { useEffect, useMemo } from 'react';
import { useSocket } from './use-socket';
import { useAuthStore } from '../store/auth.store';
import type { Message } from '../types/message.type';
import { useDebounce } from './use-debounce';

export const useAutoRead = (
  chatId: string,
  messages: Message[] | undefined,
) => {
  const socket = useSocket();
  const currentUserId = useAuthStore((state) => state.userId);

  const lastUnreadMessage = useMemo(() => {
    if (!messages || messages.length === 0) return null;

    return [...messages]
      .reverse()
      .find((msg) => !msg.isRead && msg.senderId !== currentUserId);
  }, [messages, currentUserId]);

  const debouncedMessage = useDebounce(lastUnreadMessage, 1500);

  useEffect(() => {
    if (!debouncedMessage || !socket) return;

    if (document.hasFocus()) {
      socket.emit('markAsRead', {
        chatId,
        messageId: debouncedMessage.id,
      });
    }
  }, [debouncedMessage, socket, chatId]);
};
