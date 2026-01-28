import { Loader2, SearchX } from 'lucide-react';
import { useChatList } from '../../../hooks/use-chat-list';
import { ChatListItem } from './ChatListItem';
import { useAuthStore } from '../../../store/auth.store';
import { useMemo } from 'react';

interface ChatListProps {
  searchQuery: string;
}

export const ChatList = ({ searchQuery }: ChatListProps) => {
  const { data: chats, isLoading, isError } = useChatList();
  const currentUserId = useAuthStore((state) => state.userId);

  const filteredChats = useMemo(() => {
    if (!chats) return [];
    if (!searchQuery.trim()) return chats;

    const lowerQuery = searchQuery.toLowerCase();

    return chats.filter((chat) => {
      const otherMember = chat.members.find((m) => m.user.id !== currentUserId);
      const username = otherMember?.user?.username || '';
      return username.toLowerCase().includes(lowerQuery);
    });
  }, [chats, searchQuery, currentUserId]);

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

  if ((!chats || chats.length === 0) && !searchQuery) {
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
    </div>
  );
};
