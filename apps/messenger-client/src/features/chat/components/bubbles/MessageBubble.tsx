import { MessageStatus } from '@features/chat/components/bubbles/MessageStatus';
import { AttachmentItem } from '@features/chat/components/AttachmentItem';
import { useMessageActions } from '@features/chat/hooks/use-message-actions';
import { ReplyPreview } from '@features/chat/components/message-input/ReplyPreview';
import { useMessageItem } from '@features/chat/hooks/use-message-item';
import type { Message } from '@features/chat/model/types/message.type';
import { Reply } from 'lucide-react';
import { MessageActionsMenu } from '@features/chat/components/bubbles/MessageActionsMenu';

interface MessageBubbleProps {
  message: Message;
  canMarkRead: boolean;
}

export const MessageBubble = ({ message, canMarkRead }: MessageBubbleProps) => {
  const { isMe, containerRef, handleEdit, handleDelete } = useMessageItem(
    message,
    canMarkRead,
  );
  const { replyToMessage } = useMessageActions(message.chatId);

  const bubbleBaseStyles =
    'group relative max-w-[75%] overflow-hidden rounded-2xl shadow-sm transition-all';
  const bubbleTheme = isMe
    ? 'bg-purple-600 text-white rounded-br-none'
    : 'bg-white rounded-bl-none border border-slate-100 text-slate-800';

  return (
    <div
      ref={containerRef}
      data-message-id={message.id}
      className={`group/row mb-4 flex w-full items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`${bubbleBaseStyles} ${bubbleTheme}`}>
        <ReplyPreview replyTo={message.replyTo} isMe={isMe} />

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
            <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
              {message.content}
            </p>
          )}
          <MessageStatus
            createdAt={message.createdAt}
            isEdited={message.isEdited}
            isRead={message.isRead}
            isMe={isMe}
          />
        </div>
      </div>

      <div
        className={`flex items-center gap-1 opacity-0 transition-opacity group-hover/row:opacity-100 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <button
          onClick={() => replyToMessage(message)}
          className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-purple-600 active:scale-90"
          title="Reply"
        >
          <Reply size={18} />
        </button>

        {isMe && (
          <MessageActionsMenu onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};
