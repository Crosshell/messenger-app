import { useMemo } from 'react';
import { useChatStore } from '../model/chat.store';
import { useChatList } from './use-chat-list';

export const useActiveChatSelection = () => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const { data, isLoading } = useChatList();

  const activeChat = useMemo(() => {
    if (!data?.pages || !activeChatId) return null;

    for (const page of data.pages) {
      const found = page.data.find((chat) => chat.id === activeChatId);
      if (found) return found;
    }
    return null;
  }, [data, activeChatId]);

  return {
    activeChat,
    activeChatId,
    isLoading,
  };
};
