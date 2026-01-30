import { useMemo } from 'react';
import {
  MoreVertical,
  Phone,
  Trash2,
  User as UserIcon,
  Video,
} from 'lucide-react';
import { useAuthStore } from '@features/auth/model/auth.store.ts';
import type { Chat } from '@features/chat/model/types/chat.type.ts';
import { getChatRecipient } from '@features/chat/utils/get-chat-recipient';
import { useDeleteChat } from '@features/chat/hooks/use-delete-chat';

interface ChatRecipientHeaderProps {
  chat: Chat;
}

export const ChatRecipientHeader = ({ chat }: ChatRecipientHeaderProps) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const { mutate: deleteChat, isPending } = useDeleteChat();

  const recipient = useMemo(
    () => getChatRecipient(chat, currentUserId),
    [chat, currentUserId],
  );

  if (!recipient) return null;

  const handleDeleteClick = () => {
    if (
      confirm(
        'Are you sure you want to delete this chat? This action cannot be undone',
      )
    ) {
      deleteChat(chat.id);
    }
  };

  return (
    <div className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-purple-600">
          {recipient.avatarUrl ? (
            <img
              src={recipient.avatarUrl}
              alt={recipient.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon size={20} />
          )}
        </div>
        <div>
          <h2 className="leading-tight font-semibold text-slate-900">
            {recipient.username}
          </h2>
          <span className="flex items-center gap-1 text-xs font-medium text-green-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-slate-400">
        <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
          <Phone size={20} />
        </button>
        <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
          <Video size={20} />
        </button>
        <div className="mx-1 h-6 w-px bg-slate-200" />

        <button
          onClick={handleDeleteClick}
          disabled={isPending}
          className="rounded-full p-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Delete Chat"
        >
          <Trash2 size={20} />{' '}
        </button>

        <button className="rounded-full p-2 transition-colors hover:bg-slate-100">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};
