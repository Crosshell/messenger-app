import type { Message } from '../../model/types/message.type';
import { AttachmentItem } from '../AttachmentItem';
import { useMessageItem } from '../../hooks/use-message-item';
import { MessageActionsMenu } from './MessageActionsMenu';
import { MessageStatus } from './MessageStatus';

interface MessageBubbleProps {
  message: Message;
  canMarkRead: boolean;
}

export const MessageBubble = ({ message, canMarkRead }: MessageBubbleProps) => {
  const { isMe, containerRef, handleEdit, handleDelete } = useMessageItem(
    message,
    canMarkRead,
  );

  const bubbleStyles = isMe
    ? 'bg-purple-600 text-white rounded-br-none'
    : 'bg-white rounded-bl-none border border-slate-100';

  const containerAlignment = isMe ? 'justify-end' : 'justify-start';

  return (
    <div
      ref={containerRef}
      data-message-id={message.id}
      className={`group/row mb-4 flex w-full ${containerAlignment}`}
    >
      {isMe && (
        <MessageActionsMenu onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <div
        className={`group relative max-w-[70%] overflow-hidden rounded-2xl shadow-sm ${bubbleStyles}`}
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
            <p className="mb-1 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
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
    </div>
  );
};
