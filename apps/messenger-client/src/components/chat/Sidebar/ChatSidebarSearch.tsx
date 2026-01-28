import { Search, X } from 'lucide-react';
import { Input } from '../../ui/Input.tsx';

interface ChatSidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChatSidebarSearch = ({
  value,
  onChange,
}: ChatSidebarSearchProps) => {
  return (
    <div className="px-4 pb-4 pt-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search chats..."
          icon={<Search size={18} />}
          className="bg-slate-100 border-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
