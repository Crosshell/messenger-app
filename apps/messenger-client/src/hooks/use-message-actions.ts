import { useCallback } from 'react';
import { useSocket } from './use-socket';
import type { Attachment } from '../types/attachment.type.ts';
import { useChatStore } from '../store/chat.store.ts';

export const useMessageActions = (chatId: string) => {
  const socket = useSocket();
  const setMessageToEdit = useChatStore((state) => state.setMessageToEdit);

  const editMessage = useCallback(
    (messageId: string, content: string, attachments: Attachment[] = []) => {
      socket?.emit('editMessage', {
        chatId,
        messageId,
        content,
        attachments,
      });

      setMessageToEdit(null);
    },
    [socket, chatId],
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!socket) return;

      if (confirm('Are you sure you want to delete this message?')) {
        socket.emit('deleteMessage', {
          chatId,
          messageId,
        });
      }
    },
    [socket, chatId],
  );

  return { editMessage, deleteMessage };
};
