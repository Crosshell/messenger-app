import { useCallback } from 'react';
import { useSocket } from './use-socket';
import type { Attachment } from '../types/attachment.type';

export const useSendMessage = (chatId: string) => {
  const socket = useSocket();

  const sendMessage = useCallback(
    (content: string, attachments: Attachment[] = []) => {
      if (!socket) return;

      const payload = {
        chatId,
        content: content.trim(),
        attachments,
      };

      socket.emit('sendMessage', payload);
    },
    [socket, chatId],
  );

  return { sendMessage };
};
