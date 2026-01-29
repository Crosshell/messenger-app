import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service.ts';

interface UseCreateChatProps {
  onSuccess?: () => void;
}

export const useCreateChat = ({ onSuccess }: UseCreateChatProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => chatService.createChat(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      onSuccess?.();
    },
  });
};
