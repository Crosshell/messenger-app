import { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface MessageActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const MessageActionsMenu = ({
  onEdit,
  onDelete,
}: MessageActionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative flex items-center opacity-0 transition-opacity group-hover/row:opacity-100"
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute bottom-8 z-10 flex w-32 flex-col overflow-hidden rounded-lg border border-slate-100 bg-white py-1 shadow-lg duration-100">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex w-full gap-2 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-purple-600"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex w-full gap-2 px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
