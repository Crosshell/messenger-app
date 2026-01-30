import type { Message } from '@features/chat/model/types/message.type';

export const ReplyPreview = ({
  replyTo,
  isMe,
}: {
  replyTo: Message['replyTo'];
  isMe: boolean;
}) => {
  if (!replyTo) return null;

  const nickColor = isMe ? 'text-purple-200' : 'text-purple-700';
  const bgColor = isMe ? 'bg-black/20' : 'bg-purple-50';
  const borderColor = isMe ? 'border-purple-300' : 'border-purple-400';

  return (
    <div
      className={`mx-2 mt-2 flex flex-col rounded-lg border-l-4 ${borderColor} ${bgColor} p-2 text-xs`}
    >
      <span className={`font-bold ${nickColor}`}>
        {replyTo.sender.username}
      </span>
      <span className={`truncate ${isMe ? 'text-white/80' : 'text-slate-600'}`}>
        {replyTo.content ||
          (replyTo.attachments?.length ? '📎 Attachment' : 'Message')}
      </span>
    </div>
  );
};
