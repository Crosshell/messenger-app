import type { ChangeEvent } from 'react';
import { Paperclip, Smile } from 'lucide-react';
import { useAttachments } from '../../hooks/use-attachments';
import { AttachmentPreview } from '../AttachmentPreview';
import { useMessageInput } from '../../hooks/use-message-input';
import { EditBanner } from './EditBanner';
import { SendButton } from './SendButton';

interface MessageInputProps {
  chatId: string;
  attachmentState: ReturnType<typeof useAttachments>;
}

export const MessageInput = ({
  chatId,
  attachmentState,
}: MessageInputProps) => {
  const {
    content,
    textareaRef,
    fileInputRef,
    isSubmitDisabled,
    isUploading,
    messageToEdit,
    maxLength,
    actions,
  } = useMessageInput({ chatId, attachmentState });

  const {
    files,
    existingAttachments,
    removeFile,
    removeExistingAttachment,
    error: uploadError,
  } = attachmentState;

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      actions.addFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative border-t border-slate-200 bg-white">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      {messageToEdit && (
        <EditBanner
          message={messageToEdit}
          onCancel={actions.handleCancelEdit}
        />
      )}

      <AttachmentPreview
        files={files}
        existingAttachments={existingAttachments}
        onRemoveNew={removeFile}
        onRemoveExisting={removeExistingAttachment}
        disabled={isUploading}
      />

      {uploadError && (
        <div className="border-t border-red-100 bg-red-50 px-4 py-1 text-xs text-red-500">
          {uploadError}
        </div>
      )}

      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 transition-all focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400">
          <button
            disabled={!!messageToEdit || isUploading}
            onClick={actions.triggerFileUpload}
            className="mb-0.5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-purple-600 disabled:opacity-50"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={actions.handleChange}
            onKeyDown={actions.handleKeyDown}
            onPaste={actions.handlePaste}
            maxLength={maxLength}
            placeholder={
              messageToEdit ? 'Edit your message...' : 'Type a message...'
            }
            rows={1}
            className="custom-scrollbar max-h-32 flex-1 resize-none border-none bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
          />

          <button className="mb-0.5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-yellow-500">
            <Smile size={20} />
          </button>

          <SendButton
            isUploading={isUploading}
            isEditing={!!messageToEdit}
            disabled={isSubmitDisabled}
            onClick={actions.handleSend}
          />
        </div>

        <div
          className={`px-1 text-right text-[10px] transition-colors ${
            content.length >= maxLength
              ? 'font-bold text-red-500'
              : 'text-slate-400'
          }`}
        >
          {content.length}/{maxLength}
        </div>
      </div>
    </div>
  );
};
