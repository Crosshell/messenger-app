import { useChatStore } from '../../store/chat.store';
import { useChatList } from '../../hooks/use-chat-list';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatRecipientHeader } from './ChatRecipientHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMemo } from 'react';

export const ActiveChat = () => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const { data } = useChatList();

  const activeChat = useMemo(() => {
    if (!data?.pages || !activeChatId) return;

    for (const page of data.pages) {
      const found = page.data.find((chat) => chat.id === activeChatId);
      if (found) return found;
    }
  }, [data, activeChatId]);

  if (!activeChatId || !activeChat) {
    return <ChatEmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <ChatRecipientHeader chat={activeChat} />
      <MessageList chatId={activeChatId} />
      <MessageInput chatId={activeChatId} />
    </div>
  );
};
