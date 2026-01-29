import { useCallback } from 'react';
import { useSocket } from '@shared/hooks/use-socket.ts';
import type { Attachment } from '../model/types/attachment.type.ts';

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
