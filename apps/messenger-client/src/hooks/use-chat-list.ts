import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import type { Chat } from '../types/chat.type';
import type { PaginatedResponse } from '../types/responses/paginated.response';

export const useChatList = () => {
  return useInfiniteQuery<
    PaginatedResponse<Chat>,
    Error,
    InfiniteData<PaginatedResponse<Chat>>,
    QueryKey,
    string | undefined
  >({
    queryKey: ['chats'],
    queryFn: async ({ pageParam }) => {
      return chatService.getUserChats(pageParam);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor ?? undefined;
    },
    staleTime: 1000 * 60,
  });
};
