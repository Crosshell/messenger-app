import { useEffect, useMemo } from 'react';
import { Loader2, SearchX } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useChatList } from '../../hooks/use-chat-list.ts';
import { ChatListItem } from './ChatListItem.tsx';
import { useAuthStore } from '../../../auth/model/auth.store.ts';

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
      const otherMember = chat.members.find((m) => m.user.id !== currentUserId);
      const username = otherMember?.user?.username || '';
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
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400 text-sm px-4 text-center">
        Failed to load chats
      </div>
    );
  }

  if (allChats.length === 0 && !searchQuery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
        <p>No chats yet</p>
      </div>
    );
  }

  if (filteredChats.length === 0 && searchQuery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
        <SearchX className="w-10 h-10 mb-2 opacity-50" />
        <p>No chats found</p>
        <p className="text-sm">Try searching for a new user via the + button</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {filteredChats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}

      {hasNextPage && (
        <div ref={ref} className="p-4 flex justify-center">
          {isFetchingNextPage && (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          )}
        </div>
      )}
    </div>
  );
};
