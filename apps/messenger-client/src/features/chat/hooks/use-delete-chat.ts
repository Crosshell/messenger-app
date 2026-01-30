import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import { useChatStore } from '../model/chat.store';

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const { activeChatId, setActiveChatId } = useChatStore();

  return useMutation({
    mutationFn: (chatId: string) => chatService.deleteChat(chatId),
    onSuccess: (data) => {
      if (activeChatId === data.chatId) {
        setActiveChatId(null);
      }

      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error) => {
      console.error('Failed to delete chat:', error);
    },
  });
};
