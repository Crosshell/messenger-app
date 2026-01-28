import { useCallback } from 'react';
import { useSocket } from './use-socket';

export const useSendMessage = (chatId: string) => {
  const socket = useSocket();

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !content.trim()) return;

      socket.emit('sendMessage', {
        chatId,
        content: content.trim(),
      });
    },
    [socket, chatId],
  );

  return { sendMessage };
};
