import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { chatService } from '../services/chat.service.ts';
import type { Chat } from '../model/types/chat.type.ts';
import type { PaginatedResponse } from '@shared/types/responses/paginated.response.ts';

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
