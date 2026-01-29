import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '../model/types/message.type';

export const useChatScroll = (
  chatId: string,
  messages: Message[],
  isLoading: boolean,
  currentUserId: string | null,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSnapshotRef = useRef<number | null>(null);
  const prevMessagesLengthRef = useRef(0);
  const prevLastMessageIdRef = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsReady(false);
    prevMessagesLengthRef.current = 0;
    prevLastMessageIdRef.current = null;
    scrollSnapshotRef.current = null;
    setIsAtBottom(true);

    return () => {
      queryClient.removeQueries({ queryKey: ['messages', chatId] });
    };
  }, [chatId, queryClient]);

  const saveScrollPosition = () => {
    if (containerRef.current) {
      scrollSnapshotRef.current =
        containerRef.current.scrollHeight - containerRef.current.scrollTop;
    }
  };

  useLayoutEffect(() => {
    if (!isLoading && messages.length === 0) {
      setIsReady(true);
      return;
    }

    if (!containerRef.current || messages.length === 0) return;

    const currentLength = messages.length;
    const lastMessage = messages[currentLength - 1];

    if (!isReady) {
      const firstUnread = messages.find(
        (m) => !m.isRead && m.senderId !== currentUserId,
      );

      if (firstUnread) {
        const targetElement = containerRef.current.querySelector(
          `[data-message-id="${firstUnread.id}"]`,
        ) as HTMLElement;

        if (targetElement) {
          containerRef.current.scrollTop = targetElement.offsetTop - 60;
          setIsAtBottom(false);
        }
      } else {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
      setIsReady(true);
    } else if (
      scrollSnapshotRef.current !== null &&
      currentLength > prevMessagesLengthRef.current
    ) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - scrollSnapshotRef.current;
      scrollSnapshotRef.current = null;
    } else {
      const isNew = lastMessage?.id !== prevLastMessageIdRef.current;
      const isMe = lastMessage?.senderId === currentUserId;

      if (isNew && (isMe || isAtBottom)) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }

    prevMessagesLengthRef.current = currentLength;
    prevLastMessageIdRef.current = lastMessage?.id || null;
  }, [messages, isReady, isLoading, currentUserId, isAtBottom]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 100);
  };

  return {
    containerRef,
    isReady,
    handleScroll,
    saveScrollPosition,
  };
};
