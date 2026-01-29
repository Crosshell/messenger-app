import React, { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Paperclip, Smile, X, Check, Loader2 } from 'lucide-react';
import { useSendMessage } from '../../hooks/use-send-message';
import { useChatStore } from '../../store/chat.store';
import { useMessageActions } from '../../hooks/use-message-actions';
import { useAttachments } from '../../hooks/use-attachments';
import { AttachmentPreview } from './AttachmentPreview';

interface MessageInputProps {
  chatId: string;
  attachmentState: ReturnType<typeof useAttachments>;
}

const MAX_LENGTH = 3000;

export const MessageInput = ({
  chatId,
  attachmentState,
}: MessageInputProps) => {
  const [content, setContent] = useState('');

  const {
    files,
    existingAttachments,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    isUploading,
    error: uploadError,
  } = attachmentState;

  const { sendMessage } = useSendMessage(chatId);
  const { editMessage } = useMessageActions(chatId);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messageToEdit, setMessageToEdit } = useChatStore();

  const hasChanges = () => {
    if (!messageToEdit) return true;

    const oldContent = messageToEdit.content || '';
    const newContent = content.trim();
    if (oldContent !== newContent) return true;

    if (files.length > 0) return true;

    const oldIds =
      messageToEdit.attachments
        ?.map((a) => a.id)
        .sort()
        .join(',') || '';
    const currentIds = existingAttachments
      .map((a) => a.id)
      .sort()
      .join(',');

    return oldIds !== currentIds;
  };

  useEffect(() => {
    if (messageToEdit) {
      setContent(messageToEdit.content ?? '');
      if (messageToEdit.attachments) {
        attachmentState.loadAttachments(messageToEdit.attachments);
      }
      textareaRef.current?.focus();
    }
  }, [messageToEdit]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const isMessageEmpty =
    !content.trim() && files.length === 0 && existingAttachments.length === 0;

  const isSubmitDisabled =
    isMessageEmpty || isUploading || (messageToEdit && !hasChanges());

  const handleSubmit = async () => {
    if (isMessageEmpty) return;

    try {
      const newAttachments = await uploadFiles();

      if (messageToEdit) {
        const finalAttachments = [...existingAttachments, ...newAttachments];
        editMessage(messageToEdit.id, content.trim(), finalAttachments);
      } else {
        sendMessage(content, newAttachments);
      }

      setContent('');
      clearFiles();

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    } catch (e) {
      console.error('Failed to send message', e);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitDisabled) {
        handleSubmit();
      }
    }
    if (e.key === 'Escape' && messageToEdit) {
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setMessageToEdit(null);
    setContent('');
    clearFiles();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      addFiles(e.clipboardData.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setContent(value);
    } else {
      setContent(value.slice(0, MAX_LENGTH));
    }
  };

  return (
    <div className="bg-white border-t border-slate-200">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      {messageToEdit && (
        <div className="absolute -top-10 left-0 w-full bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-sm text-slate-600 animate-in slide-in-from-bottom-2">
          <span className="flex items-center gap-2 truncate">
            <span className="font-semibold text-purple-600">Editing:</span>
            <span className="truncate max-w-50 opacity-70">
              {messageToEdit.content || '(Attachment)'}
            </span>
          </span>
          <button
            onClick={cancelEdit}
            className="text-slate-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <AttachmentPreview
        files={files}
        existingAttachments={attachmentState.existingAttachments}
        onRemoveNew={removeFile}
        onRemoveExisting={attachmentState.removeExistingAttachment}
        disabled={isUploading}
      />

      {uploadError && (
        <div className="px-4 py-1 text-xs text-red-500 bg-red-50 border-t border-red-100">
          {uploadError}
        </div>
      )}

      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition-all">
          <button
            disabled={!!messageToEdit || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-purple-600 transition-colors rounded-full hover:bg-slate-200 mb-0.5 disabled:opacity-50"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            maxLength={MAX_LENGTH}
            placeholder={
              messageToEdit ? 'Edit your message...' : 'Type a message...'
            }
            rows={1}
            className="outline-none flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-3 text-slate-800 placeholder:text-slate-400 custom-scrollbar"
          />

          <button className="p-2 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-slate-200 mb-0.5">
            <Smile size={20} />
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled ?? false}
            className={`p-2 text-white rounded-xl transition-all shadow-sm mb-0.5 ${
              isSubmitDisabled
                ? 'bg-slate-400 cursor-not-allowed opacity-50'
                : messageToEdit
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : messageToEdit ? (
              <Check size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        <div
          className={`text-[10px] text-right px-1 transition-colors ${
            content.length >= MAX_LENGTH
              ? 'text-red-500 font-bold'
              : 'text-slate-400'
          }`}
        >
          {content.length}/{MAX_LENGTH}
        </div>
      </div>
    </div>
  );
};
