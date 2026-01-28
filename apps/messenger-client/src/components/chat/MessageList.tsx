import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { messageService } from '../../services/message.service';
import { MessageBubble } from './MessageBubble';
import { useAutoRead } from '../../hooks/use-auto-read';
import { useChatSubscription } from '../../hooks/use-chat-subscription';

interface MessageListProps {
  chatId: string;
}

export const MessageList = ({ chatId }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: messages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => messageService.getMessages(chatId),
    refetchOnWindowFocus: false,
  });

  useChatSubscription(chatId);

  useAutoRead(chatId, messages);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom('auto');
    }
  }, [messages?.length, chatId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Something went wrong loading messages
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col">
      <div className="flex-1" />

      {messages?.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
