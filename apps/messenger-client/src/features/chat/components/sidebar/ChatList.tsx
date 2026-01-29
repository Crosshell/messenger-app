import { useEffect, useMemo } from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useChatList } from '../../hooks/use-chat-list.ts';
import { ChatListItem } from './ChatListItem.tsx';
import { useAuthStore } from '../../../auth/model/auth.store.ts';
import { getChatRecipient } from '@features/chat/utils/get-chat-recipient';

interface ChatListProps {
  searchQuery: string;
}

export const ChatList = ({ searchQuery }: ChatListProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatList();

  const currentUserId = useAuthStore((state) => state.userId);

  const { ref, inView } = useInView();

  const allChats = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data?.pages]);

  const filteredChats = useMemo(() => {
    if (!allChats) return [];
    if (!searchQuery.trim()) return allChats;

    const lowerQuery = searchQuery.toLowerCase();

    return allChats.filter((chat) => {
      const recipient = getChatRecipient(chat, currentUserId);
      const username = recipient?.username || '';
      return username.toLowerCase().includes(lowerQuery);
    });
  }, [allChats, searchQuery, currentUserId]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-red-400">
        Failed to load chats
      </div>
    );
  }

  if (allChats.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-slate-400">
        <p>No chats yet</p>
      </div>
    );
  }

  if (filteredChats.length === 0 && searchQuery) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center text-slate-400">
        <SearchX className="mb-2 h-10 w-10 opacity-50" />
        <p>No chats found</p>
        <p className="text-sm">Try searching for a new user via the + button</p>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto">
      {filteredChats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}

      {hasNextPage && (
        <div ref={ref} className="flex justify-center p-4">
          {isFetchingNextPage && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          )}
        </div>
      )}
    </div>
  );
};
