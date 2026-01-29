import { X } from 'lucide-react';
import type { Message } from '@features/chat/model/types/message.type.ts';

interface EditBannerProps {
  message: Message;
  onCancel: () => void;
}

export const EditBanner = ({ message, onCancel }: EditBannerProps) => (
  <div className="animate-in slide-in-from-bottom-2 absolute -top-10 left-0 flex w-full items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
    <span className="flex items-center gap-2 truncate">
      <span className="font-semibold text-purple-600">Editing:</span>
      <span className="max-w-50 truncate opacity-70">
        {message.content || '(Attachment)'}
      </span>
    </span>
    <button
      onClick={onCancel}
      className="text-slate-400 transition-colors hover:text-red-500"
    >
      <X size={16} />
    </button>
  </div>
);
