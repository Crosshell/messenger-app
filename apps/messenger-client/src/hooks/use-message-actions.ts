import { useCallback } from 'react';
import { useSocket } from './use-socket';
import { useChatStore } from '../store/chat.store';

export const useMessageActions = (chatId: string) => {
  const socket = useSocket();
  const setMessageToEdit = useChatStore((state) => state.setMessageToEdit);

  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (!socket) return;

      socket.emit('editMessage', {
        chatId,
        messageId,
        content: newContent,
      });

      setMessageToEdit(null);
    },
    [socket, chatId, setMessageToEdit],
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
