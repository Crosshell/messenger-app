import { useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { MessageBubble } from './bubbles/MessageBubble.tsx';
import { useChatSubscription } from '../hooks/use-chat-subscription.ts';
import { useChatMessages } from '../hooks/use-chat-messages.ts';
import { useChatScroll } from '../hooks/use-chat-scroll.ts';
import { useAuthStore } from '../../auth/model/auth.store.ts';

interface MessageListProps {
  chatId: string;
}

export const MessageList = ({ chatId }: MessageListProps) => {
  const currentUserId = useAuthStore((state) => state.userId);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(chatId);

  useChatSubscription(chatId);

  const messages = useMemo(
    () => data?.pages.flatMap((p) => p) || [],
    [data?.pages],
  );

  const { containerRef, isReady, handleScroll, saveScrollPosition } =
    useChatScroll(chatId, messages, isLoading, currentUserId);

  const { ref: topTriggerRef, inView: topInView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (topInView && hasNextPage && !isFetchingNextPage) {
      saveScrollPosition();
      fetchNextPage();
    }
  }, [
    topInView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    saveScrollPosition,
  ]);

  if (isLoading && !isReady) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (isError)
    return (
      <div className="flex-1 text-center text-red-500 mt-10">
        Error loading messages
      </div>
    );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col transition-opacity duration-150 ${isReady ? 'opacity-100' : 'opacity-0'}`}
    >
      {hasNextPage && (
        <div ref={topTriggerRef} className="h-8 flex justify-center shrink-0">
          {isFetchingNextPage && (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          )}
        </div>
      )}
      {!hasNextPage && <div className="flex-1" />}

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          canMarkRead={isReady}
        />
      ))}
    </div>
  );
};
