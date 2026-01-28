import { useEffect } from 'react';
import { useSocket } from './use-socket';

interface UseMarkReadProps {
  inView: boolean;
  isMe: boolean;
  isRead: boolean;
  chatId: string;
  messageId: string;
}

export const useMarkRead = ({
  inView,
  isMe,
  isRead,
  chatId,
  messageId,
}: UseMarkReadProps) => {
  const socket = useSocket();

  useEffect(() => {
    if (inView && !isMe && !isRead && socket) {
      socket.emit('markAsRead', {
        chatId,
        lastMessageId: messageId,
      });
    }
  }, [inView, isMe, isRead, chatId, messageId, socket]);
};
