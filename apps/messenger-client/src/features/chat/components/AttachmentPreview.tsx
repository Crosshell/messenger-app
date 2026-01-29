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
    <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50 border-t border-slate-200">
      {existingAttachments.map((att) => {
        const isImage = att.mimeType?.startsWith('image/');

        return (
          <div
            key={att.id}
            className="relative group shrink-0 w-24 h-24 bg-white rounded-lg border border-purple-200 overflow-hidden flex items-center justify-center"
          >
            {isImage ? (
              <img
                src={att.url}
                alt="preview"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="text-purple-500 flex flex-col items-center p-2 text-center">
                <FileText size={24} className="mb-1" />
                <span className="text-[10px] truncate w-full">
                  {att.filename}
                </span>
              </div>
            )}
            <button
              onClick={() => att.id && onRemoveExisting(att.id)}
              disabled={disabled}
              className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"
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
            className="relative group shrink-0 w-24 h-24 bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center"
          >
            {isImage && previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-slate-400 flex flex-col items-center p-2 text-center">
                <FileText size={24} className="mb-1" />
                <span className="text-[10px] truncate w-full">{file.name}</span>
              </div>
            )}

            <button
              onClick={() => onRemoveNew(index)}
              disabled={disabled}
              className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
