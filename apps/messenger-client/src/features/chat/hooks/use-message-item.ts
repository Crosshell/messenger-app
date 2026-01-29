import { useAuthStore } from '@features/auth/model/auth.store';
import { useChatStore } from '../model/chat.store';
import { useMessageActions } from './use-message-actions';
import { useMarkRead } from './use-mark-read';
import { useInView } from 'react-intersection-observer';
import type { Message } from '../model/types/message.type';

export const useMessageItem = (message: Message, canMarkRead: boolean) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const setMessageToEdit = useChatStore((state) => state.setMessageToEdit);
  const { deleteMessage } = useMessageActions(message.chatId);

  const isMe = message.senderId === currentUserId;

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    skip: isMe || message.isRead || !canMarkRead,
  });

  useMarkRead({
    inView,
    isMe,
    isRead: message.isRead,
    chatId: message.chatId,
    messageId: message.id,
  });

  const handleEdit = () => setMessageToEdit(message);

  const handleDelete = () => deleteMessage(message.id);

  return {
    isMe,
    containerRef: ref,
    handleEdit,
    handleDelete,
  };
};
