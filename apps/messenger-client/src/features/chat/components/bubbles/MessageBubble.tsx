import { useState } from 'react';
import { formatMessageDate } from '@shared/utils/date.util.ts';
import { useAuthStore } from '../../../auth/model/auth.store.ts';
import type { Message } from '../../model/types/message.type.ts';
import { Check, CheckCheck, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useChatStore } from '../../model/chat.store.ts';
import { useMessageActions } from '../../hooks/use-message-actions.ts';
import { useInView } from 'react-intersection-observer';
import { useMarkRead } from '../../hooks/use-mark-read.ts';
import { AttachmentItem } from '../AttachmentItem.tsx';

interface MessageBubbleProps {
  message: Message;
  canMarkRead: boolean;
}

export const MessageBubble = ({ message, canMarkRead }: MessageBubbleProps) => {
  const currentUserId = useAuthStore((state) => state.userId);
  const setMessageToEdit = useChatStore((state) => state.setMessageToEdit);
  const { deleteMessage } = useMessageActions(message.chatId);
  const [showMenu, setShowMenu] = useState(false);

  const isMe = message.senderId === currentUserId;

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    skip: isMe || message.isRead || !canMarkRead,
  });

  useMarkRead({
    inView,
    isMe,
    isRead: message.isRead,
    chatId: message.chatId,
    messageId: message.id,
  });

  return (
    <div
      ref={ref}
      data-message-id={message.id}
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
                onClick={() => {
                  setMessageToEdit(message);
                  setShowMenu(false);
                }}
                className="flex gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  deleteMessage(message.id);
                  setShowMenu(false);
                }}
                className="flex gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl shadow-sm relative group overflow-hidden ${
          isMe
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-white rounded-bl-none border border-slate-100'
        }`}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-col gap-1">
            {message.attachments.map((att) => (
              <AttachmentItem
                key={att.id || att.url}
                attachment={att}
                isMe={isMe}
              />
            ))}
          </div>
        )}
        <div className="px-4 py-2">
          {message.content && (
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed mb-1">
              {message.content}
            </p>
          )}
          <div
            className={`flex items-center justify-end gap-1 text-[10px] select-none mt-1 ${isMe ? 'text-purple-200' : 'text-slate-400'}`}
          >
            {message.isEdited && <span className="italic mr-1">edited</span>}
            <span>{formatMessageDate(message.createdAt)}</span>
            {isMe &&
              (message.isRead ? (
                <CheckCheck
                  size={14}
                  strokeWidth={2}
                  className="text-blue-200"
                />
              ) : (
                <Check size={14} strokeWidth={2} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
