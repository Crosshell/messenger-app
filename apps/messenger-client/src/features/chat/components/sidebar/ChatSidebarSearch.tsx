import { Search, X } from 'lucide-react';
import { Input } from '@ui/Input.tsx';

interface ChatSidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChatSidebarSearch = ({
  value,
  onChange,
}: ChatSidebarSearchProps) => {
  return (
    <div className="px-4 pt-2 pb-4">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search chats..."
          icon={<Search size={18} />}
          className="border-none bg-slate-100 transition-all focus:bg-white focus:ring-1 focus:ring-purple-500"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
