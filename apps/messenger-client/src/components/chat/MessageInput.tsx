import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Paperclip, Smile, X, Check } from 'lucide-react';
import { useSendMessage } from '../../hooks/use-send-message.ts';
import { useChatStore } from '../../store/chat.store.ts';
import { useMessageActions } from '../../hooks/use-message-actions.ts';

interface MessageInputProps {
  chatId: string;
}

export const MessageInput = ({ chatId }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const { sendMessage } = useSendMessage(chatId);
  const { editMessage } = useMessageActions(chatId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messageToEdit, setMessageToEdit } = useChatStore();

  useEffect(() => {
    if (messageToEdit) {
      setContent(messageToEdit.content);
      textareaRef.current?.focus();
    }
  }, [messageToEdit]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    if (messageToEdit) {
      editMessage(messageToEdit.id, content.trim());
    } else {
      sendMessage(content);
    }

    setContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && messageToEdit) {
      setMessageToEdit(null);
      setContent('');
    }
  };

  const cancelEdit = () => {
    setMessageToEdit(null);
    setContent('');
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      {messageToEdit && (
        <div className="absolute -top-10 left-0 w-full bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-sm text-slate-600 animate-in slide-in-from-bottom-2">
          <span className="flex items-center gap-2 truncate">
            <span className="font-semibold text-purple-600">Editing:</span>
            <span className="truncate max-w-50 opacity-70">
              {messageToEdit.content}
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

      <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition-all">
        <button
          disabled={!!messageToEdit}
          className="p-2 text-slate-400 hover:text-purple-600 transition-colors rounded-full hover:bg-slate-200 mb-0.5 disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
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
          disabled={!content.trim()}
          className={`p-2 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm mb-0.5 ${messageToEdit ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {messageToEdit ? <Check size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};
