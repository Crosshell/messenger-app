import type { ChangeEvent } from 'react';
import { Paperclip } from 'lucide-react';
import { useAttachments } from '../../hooks/use-attachments';
import { AttachmentPreview } from '../AttachmentPreview';
import { useMessageInput } from '../../hooks/use-message-input';
import { EditBanner } from './EditBanner';
import { SendButton } from './SendButton';
import { MAX_MESSAGE_LENGTH } from '@shared/constants/app.constants';
import { ReplyBanner } from '@features/chat/components/message-input/ReplyBanner';
import type { EmojiClickData } from 'emoji-picker-react';
import { EmojiPickerButton } from '@features/chat/components/message-input/EmojiPickerButton';

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
    messageToReply,
    isSubmitDisabled,
    isUploading,
    messageToEdit,
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

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        content.substring(0, start) + emoji + content.substring(end);

      if (newContent.length <= MAX_MESSAGE_LENGTH) {
        actions.setContent(newContent);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + emoji.length,
            start + emoji.length,
          );
        }, 0);
      }
    } else {
      actions.setContent(content + emoji);
    }
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

      {!messageToEdit && messageToReply && (
        <ReplyBanner
          message={messageToReply}
          onCancel={actions.handleCancelReply}
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
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={
              messageToEdit ? 'Edit your message...' : 'Type a message...'
            }
            rows={1}
            className="custom-scrollbar max-h-32 flex-1 resize-none border-none bg-transparent py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
          />

          <EmojiPickerButton
            onEmojiSelect={handleEmojiSelect}
            disabled={isUploading}
          />

          <SendButton
            isUploading={isUploading}
            isEditing={!!messageToEdit}
            disabled={isSubmitDisabled}
            onClick={actions.handleSend}
          />
        </div>

        <div
          className={`px-1 text-right text-[10px] transition-colors ${
            content.length >= MAX_MESSAGE_LENGTH
              ? 'font-bold text-red-500'
              : 'text-slate-400'
          }`}
        >
          {content.length}/{MAX_MESSAGE_LENGTH}
        </div>
      </div>
    </div>
  );
};
