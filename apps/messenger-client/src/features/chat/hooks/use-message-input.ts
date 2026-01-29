import {
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useChatStore } from '../model/chat.store';
import { useSendMessage } from './use-send-message';
import { useMessageActions } from './use-message-actions';
import { useAttachments } from './use-attachments';
import { MAX_MESSAGE_LENGTH } from '@shared/constants/app.constants.ts';

interface UseMessageInputProps {
  chatId: string;
  attachmentState: ReturnType<typeof useAttachments>;
}

export const useMessageInput = ({
  chatId,
  attachmentState,
}: UseMessageInputProps) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messageToEdit, setMessageToEdit } = useChatStore();
  const { sendMessage } = useSendMessage(chatId);
  const { editMessage } = useMessageActions(chatId);

  const {
    files,
    existingAttachments,
    uploadFiles,
    clearFiles,
    addFiles,
    isUploading,
  } = attachmentState;

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

  const handleSend = async () => {
    const isMessageEmpty =
      !content.trim() && files.length === 0 && existingAttachments.length === 0;
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
      if (!isUploading && (messageToEdit ? hasChanges() : true)) {
        handleSend();
      }
    }
    if (e.key === 'Escape' && messageToEdit) {
      handleCancelEdit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value.slice(0, MAX_MESSAGE_LENGTH));
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      e.preventDefault();
      addFiles(e.clipboardData.files);
    }
  };

  const handleCancelEdit = () => {
    setMessageToEdit(null);
    setContent('');
    clearFiles();
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const isSubmitDisabled =
    (!content.trim() &&
      files.length === 0 &&
      existingAttachments.length === 0) ||
    isUploading ||
    (!!messageToEdit && !hasChanges());

  return {
    content,
    textareaRef,
    fileInputRef,
    isSubmitDisabled,
    isUploading,
    messageToEdit,
    maxLength: MAX_MESSAGE_LENGTH,
    actions: {
      setContent,
      handleSend,
      handleKeyDown,
      handleChange,
      handlePaste,
      handleCancelEdit,
      triggerFileUpload,
      addFiles,
    },
  };
};
