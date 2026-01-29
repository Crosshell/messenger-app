import type { Attachment } from '../../types/attachment.type.ts';
import { FileIcon } from 'lucide-react';
import { useUIStore } from '../../store/ui.store.ts';

interface AttachmentItemProps {
  attachment: Attachment;
  isMe: boolean;
}

export const AttachmentItem = ({ attachment, isMe }: AttachmentItemProps) => {
  const setPreviewImage = useUIStore((state) => state.setPreviewImage);

  const isImage = attachment.mimeType?.startsWith('image/');
  if (isImage) {
    return (
      <div className="w-full">
        <img
          src={attachment.url}
          alt={attachment.filename}
          draggable={false}
          onClick={() =>
            setPreviewImage({
              url: attachment.url,
              filename: attachment.filename,
            })
          }
          className="w-full max-h-96 object-cover cursor-zoom-in hover:brightness-90 transition-all select-none"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="p-2 pb-0">
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 p-3 rounded-xl transition-colors border ${
          isMe
            ? 'bg-purple-700/50 border-purple-400/30 text-white hover:bg-purple-700/70'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
      >
        <div
          className={
            isMe
              ? 'bg-purple-500/30 p-2 rounded-lg'
              : 'bg-white p-2 rounded-lg shadow-sm'
          }
        >
          <FileIcon
            size={20}
            className={isMe ? 'text-purple-100' : 'text-purple-500'}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.filename}</p>
          {attachment.size && (
            <p
              className={
                isMe ? 'text-xs text-purple-200' : 'text-xs text-slate-400'
              }
            >
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </a>
    </div>
  );
};
