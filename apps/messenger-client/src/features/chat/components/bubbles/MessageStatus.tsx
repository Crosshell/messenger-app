import { Check, CheckCheck } from 'lucide-react';
import { formatMessageDate } from '@shared/utils/date.util';

interface MessageStatusProps {
  createdAt: string;
  isEdited: boolean;
  isRead: boolean;
  isMe: boolean;
}

export const MessageStatus = ({
  createdAt,
  isEdited,
  isRead,
  isMe,
}: MessageStatusProps) => {
  return (
    <div
      className={`mt-1 flex items-center justify-end gap-1 text-[10px] select-none ${
        isMe ? 'text-purple-200' : 'text-slate-400'
      }`}
    >
      {isEdited && <span className="mr-1 italic">edited</span>}

      <span>{formatMessageDate(createdAt)}</span>

      {isMe &&
        (isRead ? (
          <CheckCheck size={14} strokeWidth={2} className="text-blue-200" />
        ) : (
          <Check size={14} strokeWidth={2} />
        ))}
    </div>
  );
};
