import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import type { Chat } from '../types/chat.type';

export const useChatList = () => {
  return useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: chatService.getUserChats,
    staleTime: 1000 * 60,
  });
};
