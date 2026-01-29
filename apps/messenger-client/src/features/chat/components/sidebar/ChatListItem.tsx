import { useMemo } from 'react';
import { Check, CheckCheck, User as UserIcon } from 'lucide-react';
import type { Chat } from '../../model/types/chat.type';
import { useAuthStore } from '../../../auth/model/auth.store';
import { useChatStore } from '../../model/chat.store';
import { formatMessageDate } from '@shared/utils/date.util';
import { getChatRecipient } from '../../utils/get-chat-recipient';
import { LastMessagePreview } from './LastMessagePreview';

interface ChatListItemProps {
  chat: Chat;
}

export const ChatListItem = ({ chat }: ChatListItemProps) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const { activeChatId, setActiveChatId } = useChatStore();

  const recipient = useMemo(
    () => getChatRecipient(chat, currentUserId),
    [chat, currentUserId],
  );

  const lastMessage = chat.messages?.[0];
  const isActive = activeChatId === chat.id;
  const isMyLastMessage = lastMessage?.senderId === currentUserId;

  const username = recipient?.username || 'Unknown User';

  return (
    <button
      onClick={() => setActiveChatId(chat.id)}
      className={`flex w-full items-center gap-3 border-b border-slate-50 p-3 text-left transition-colors hover:bg-slate-50 ${isActive ? 'bg-purple-50 hover:bg-purple-50' : ''}`}
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-500">
          {recipient?.avatarUrl ? (
            <img
              src={recipient.avatarUrl}
              alt={username}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon size={24} />
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between">
          <span className="truncate font-semibold text-slate-900">
            {username}
          </span>
          {lastMessage && (
            <span className="ml-2 shrink-0 text-xs text-slate-400">
              {formatMessageDate(lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="flex flex-1 items-center truncate text-sm text-slate-500">
            {isMyLastMessage && (
              <span className="mr-1 flex shrink-0 items-center gap-1">
                <span className="mr-1 text-purple-600">You:</span>
                {lastMessage?.isRead ? (
                  <CheckCheck size={14} className="text-blue-500" />
                ) : (
                  <Check size={14} className="text-slate-400" />
                )}
              </span>
            )}

            <LastMessagePreview message={lastMessage} />
          </p>

          {chat.unreadCount > 0 && (
            <div className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
