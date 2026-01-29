import React, { useCallback, useMemo, useState } from 'react';
import { useChatStore } from '../model/chat.store.ts';
import { useChatList } from '../hooks/use-chat-list.ts';
import { ChatEmptyState } from './ChatEmptyState.tsx';
import { ChatRecipientHeader } from './ChatRecipientHeader.tsx';
import { MessageList } from './MessageList.tsx';
import { MessageInput } from './MessageInput.tsx';
import { UploadCloud } from 'lucide-react';
import { useAttachments } from '../hooks/use-attachments.ts';

export const ActiveChat = () => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const { data } = useChatList();

  const attachmentState = useAttachments();
  const [isDragging, setIsDragging] = useState(false);

  const activeChat = useMemo(() => {
    if (!data?.pages || !activeChatId) return;

    for (const page of data.pages) {
      const found = page.data.find((chat) => chat.id === activeChatId);
      if (found) return found;
    }
  }, [data, activeChatId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        attachmentState.addFiles(e.dataTransfer.files);
      }
    },
    [attachmentState],
  );

  if (!activeChatId || !activeChat) {
    return <ChatEmptyState />;
  }

  return (
    <div
      className="relative flex h-full flex-1 flex-col overflow-hidden bg-slate-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center border-2 border-dashed border-purple-500 bg-purple-500/10 backdrop-blur-sm">
          <UploadCloud
            size={64}
            className="mb-4 animate-bounce text-purple-600"
          />
          <p className="text-xl font-bold text-purple-700">
            Drop files to upload
          </p>
        </div>
      )}

      <ChatRecipientHeader chat={activeChat} />
      <MessageList chatId={activeChatId} />

      <MessageInput chatId={activeChatId} attachmentState={attachmentState} />
    </div>
  );
};
