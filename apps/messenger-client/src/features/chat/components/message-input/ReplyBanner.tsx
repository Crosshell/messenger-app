import { Reply, X } from 'lucide-react';
import type { Message } from '@features/chat/model/types/message.type.ts';

interface ReplyBannerProps {
  message: Message;
  onCancel: () => void;
}

export const ReplyBanner = ({ message, onCancel }: ReplyBannerProps) => (
  <div className="animate-in slide-in-from-bottom-2 absolute -top-10 left-0 flex w-full items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
    <div className="flex items-center gap-2 truncate">
      <Reply size={16} className="text-purple-600" />
      <div className="flex flex-col truncate">
        <span className="text-xs font-semibold text-purple-600">
          Replying to {message.sender?.username || 'User'}
        </span>
        <span className="max-w-50 truncate text-xs opacity-70">
          {message.content ||
            (message.attachments?.length ? 'Attachment' : 'Message')}
        </span>
      </div>
    </div>
    <button
      onClick={onCancel}
      className="text-slate-400 transition-colors hover:text-red-500"
    >
      <X size={16} />
    </button>
  </div>
);
