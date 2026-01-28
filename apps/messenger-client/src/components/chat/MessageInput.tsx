import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useSendMessage } from '../../hooks/use-send-message.ts';

interface MessageInputProps {
  chatId: string;
}

export const MessageInput = ({ chatId }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const { sendMessage } = useSendMessage(chatId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSendMessage = () => {
    if (!content.trim()) return;

    sendMessage(content);

    setContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition-all">
        <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors rounded-full hover:bg-slate-200 mb-0.5">
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="outline-none flex-1 max-h-32 bg-transparent border-none focus:ring-0 resize-none py-3 text-slate-800 placeholder:text-slate-400 custom-scrollbar"
        />

        <button className="p-2 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-slate-200 mb-0.5">
          <Smile size={20} />
        </button>

        <button
          onClick={handleSendMessage}
          disabled={!content.trim()}
          className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm mb-0.5"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
