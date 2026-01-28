import { useState } from 'react';
import { formatMessageDate } from '../../utils/date.util';
import { useAuthStore } from '../../store/auth.store';
import type { Message } from '../../types/message.type';
import { Check, CheckCheck, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useChatStore } from '../../store/chat.store';
import { useMessageActions } from '../../hooks/use-message-actions.ts';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const setMessageToEdit = useChatStore((state) => state.setMessageToEdit);
  const { deleteMessage } = useMessageActions(message.chatId);

  const [showMenu, setShowMenu] = useState(false);

  const isMe = message.senderId === currentUserId;

  const handleEdit = () => {
    setMessageToEdit(message);
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    setShowMenu(false);
  };

  return (
    <div
      className={`flex w-full mb-4 group/row ${isMe ? 'justify-end' : 'justify-start'}`}
      onMouseLeave={() => setShowMenu(false)}
    >
      {isMe && (
        <div className="relative flex items-center mr-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute bottom-8 right-0 bg-white shadow-lg border border-slate-100 rounded-lg py-1 w-32 z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600 text-left"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 text-left"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}

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
          className={`flex items-center justify-end gap-1 text-[10px] select-none mt-1
          ${isMe ? 'text-purple-200' : 'text-slate-400'}`}
        >
          {message.isEdited && <span className="italic mr-1">edited</span>}

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
