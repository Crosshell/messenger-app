import { formatMessageDate } from '../../utils/date.util';
import { useAuthStore } from '../../store/auth.store';
import type { Message } from '../../types/message.type';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const isMe = message.senderId === currentUserId;

  return (
    <div
      className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative group
          ${
            isMe
              ? 'bg-purple-600 text-white rounded-br-none'
              : 'bg-white rounded-bl-none border border-slate-100'
          }
        `}
      >
        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
          {message.content}
        </p>

        <div
          className={`flex items-center justify-end gap-1 text-[10px] select-none
          ${isMe ? 'text-purple-200' : 'text-slate-400'}`}
        >
          <span>{formatMessageDate(message.createdAt)}</span>

          {isMe && (
            <span className={message.isRead ? 'text-blue-200' : ''}>
              {message.isRead ? (
                <CheckCheck size={14} strokeWidth={2} />
              ) : (
                <Check size={14} strokeWidth={2} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
