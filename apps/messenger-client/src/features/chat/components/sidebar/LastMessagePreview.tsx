import { Paperclip } from 'lucide-react';
import type { Message } from '../../model/types/message.type';

interface LastMessagePreviewProps {
  message?: Message;
}

export const LastMessagePreview = ({ message }: LastMessagePreviewProps) => {
  if (!message) {
    return <span className="text-slate-400 italic">No messages yet</span>;
  }

  if (message.content) {
    return <span className="truncate">{message.content}</span>;
  }

  if (message.attachments && message.attachments.length > 0) {
    const count = message.attachments.length;
    return (
      <span className="flex items-center gap-1 text-slate-500 italic">
        <Paperclip size={12} />
        {count > 1 ? `${count} files` : 'File'}
      </span>
    );
  }

  return <span className="text-slate-400 italic">Empty message</span>;
};
