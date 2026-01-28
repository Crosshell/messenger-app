import { useMemo } from 'react';
import { MoreVertical, Phone, User as UserIcon, Video } from 'lucide-react';
import type { Chat } from '../../types/chat.type';
import { useAuthStore } from '../../store/auth.store';

interface ChatRecipientHeaderProps {
  chat: Chat;
}

export const ChatRecipientHeader = ({ chat }: ChatRecipientHeaderProps) => {
  const currentUserId = useAuthStore((state) => state.userId);

  const recipient = useMemo(() => {
    return chat.members.find((m) => m.user.id !== currentUserId)?.user;
  }, [chat.members, currentUserId]);

  if (!recipient) return null;

  return (
    <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden text-purple-600">
          {recipient.avatarUrl ? (
            <img
              src={recipient.avatarUrl}
              alt={recipient.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={20} />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 leading-tight">
            {recipient.username}
          </h2>
          <span className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-slate-400">
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Phone size={20} />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Video size={20} />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};
