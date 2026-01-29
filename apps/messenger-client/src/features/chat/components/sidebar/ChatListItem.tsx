import { useMemo } from 'react';
import { Check, CheckCheck, Paperclip, User as UserIcon } from 'lucide-react';
import type { Chat } from '../../model/types/chat.type.ts';
import { useAuthStore } from '../../../auth/model/auth.store.ts';
import { useChatStore } from '../../model/chat.store.ts';
import { formatMessageDate } from '@shared/utils/date.util.ts';

interface ChatListItemProps {
  chat: Chat;
}

export const ChatListItem = ({ chat }: ChatListItemProps) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const { activeChatId, setActiveChatId } = useChatStore();

  const targetUser = useMemo(() => {
    if (!chat.members) return null;
    const member = chat.members.find((m) => m.user.id !== currentUserId);
    return member ? member.user : chat.members[0]?.user;
  }, [chat.members, currentUserId]);

  const username = targetUser?.username || 'Unknown User';
  const avatarUrl = targetUser?.avatarUrl;

  const lastMessage = chat.messages?.[0];
  const isActive = activeChatId === chat.id;

  const isMyLastMessage = lastMessage?.senderId === currentUserId;
  const isMessageRead = lastMessage?.isRead;

  const messagePreview = useMemo(() => {
    if (!lastMessage)
      return <span className="italic text-slate-400">No messages yet</span>;

    if (lastMessage.content) {
      return <span className="truncate">{lastMessage.content}</span>;
    }

    if (lastMessage.attachments && lastMessage.attachments.length > 0) {
      return (
        <span className="flex items-center gap-1 text-slate-500 italic">
          <Paperclip size={12} />
          {lastMessage.attachments.length > 1
            ? `${lastMessage.attachments.length} files`
            : 'File'}
        </span>
      );
    }

    return <span className="italic text-slate-400">Empty message</span>;
  }, [lastMessage]);

  return (
    <button
      onClick={() => setActiveChatId(chat.id)}
      className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 ${isActive ? 'bg-purple-50 hover:bg-purple-50' : ''}`}
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden text-slate-500">
          {targetUser?.avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={24} />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-slate-900 truncate">
            {username}
          </span>
          {lastMessage && (
            <span className="text-xs text-slate-400 shrink-0 ml-2">
              {formatMessageDate(lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-slate-500 truncate flex-1 flex items-center">
            {lastMessage && isMyLastMessage && (
              <span className="mr-1 flex items-center shrink-0">
                <span className="text-purple-600 mr-1">You:</span>
                {isMessageRead ? (
                  <CheckCheck size={14} className="text-blue-500" />
                ) : (
                  <Check size={14} className="text-slate-400" />
                )}
              </span>
            )}

            {messagePreview}
          </p>

          {chat.unreadCount > 0 && (
            <div className="shrink-0 bg-purple-600 text-white text-[10px] font-bold h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full shadow-sm">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
