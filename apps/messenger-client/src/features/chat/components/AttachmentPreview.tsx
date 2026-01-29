import { FileText, X } from 'lucide-react';
import type { Attachment } from '../model/types/attachment.type.ts';

interface AttachmentPreviewProps {
  files: File[];
  existingAttachments: Attachment[];
  onRemoveNew: (index: number) => void;
  onRemoveExisting: (id: string) => void;
  disabled?: boolean;
}

export const AttachmentPreview = ({
  files,
  existingAttachments,
  onRemoveNew,
  onRemoveExisting,
  disabled,
}: AttachmentPreviewProps) => {
  if (files.length === 0 && existingAttachments.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-slate-50 p-4">
      {existingAttachments.map((att) => {
        const isImage = att.mimeType?.startsWith('image/');

        return (
          <div
            key={att.id}
            className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-purple-200 bg-white"
          >
            {isImage ? (
              <img
                src={att.url}
                alt="preview"
                className="h-full w-full object-cover opacity-80"
              />
            ) : (
              <div className="flex flex-col items-center p-2 text-center text-purple-500">
                <FileText size={24} className="mb-1" />
                <span className="w-full truncate text-[10px]">
                  {att.filename}
                </span>
              </div>
            )}
            <button
              onClick={() => att.id && onRemoveExisting(att.id)}
              disabled={disabled}
              className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      {files.map((file, index) => {
        const isImage = file.type.startsWith('image/');
        const previewUrl = isImage ? URL.createObjectURL(file) : null;

        return (
          <div
            key={`new-${index}`}
            className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            {isImage && previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center p-2 text-center text-slate-400">
                <FileText size={24} className="mb-1" />
                <span className="w-full truncate text-[10px]">{file.name}</span>
              </div>
            )}

            <button
              onClick={() => onRemoveNew(index)}
              disabled={disabled}
              className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500 disabled:opacity-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
