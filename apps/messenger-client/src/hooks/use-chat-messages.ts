import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { messageService } from '../services/message.service';
import type { Message } from '../types/message.type';

export const useChatMessages = (chatId: string) => {
  return useInfiniteQuery<
    Message[],
    Error,
    InfiniteData<Message[]>,
    QueryKey,
    string | undefined
  >({
    queryKey: ['messages', chatId],
    queryFn: async ({ pageParam }) => {
      return messageService.getMessages(chatId, 20, pageParam);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 20) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    select: (data) => ({
      pages: [...data.pages].reverse().map((page) => [...page].reverse()),
      pageParams: [...data.pageParams].reverse(),
    }),
  });
};
