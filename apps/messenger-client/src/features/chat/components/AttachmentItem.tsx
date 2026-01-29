import type { Attachment } from '../model/types/attachment.type.ts';
import { FileIcon } from 'lucide-react';
import { useUIStore } from '@shared/store/ui.store.ts';

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
          className="max-h-96 w-full cursor-zoom-in object-cover transition-all select-none hover:brightness-90"
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
        className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
          isMe
            ? 'border-purple-400/30 bg-purple-700/50 text-white hover:bg-purple-700/70'
            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
        }`}
      >
        <div
          className={
            isMe
              ? 'rounded-lg bg-purple-500/30 p-2'
              : 'rounded-lg bg-white p-2 shadow-sm'
          }
        >
          <FileIcon
            size={20}
            className={isMe ? 'text-purple-100' : 'text-purple-500'}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{attachment.filename}</p>
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
