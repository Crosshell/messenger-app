import { useState } from 'react';
import { LogOut, MessageSquare, Plus } from 'lucide-react';
import { useAuthStore } from '../../../auth/model/auth.store.ts';
import { CreateChatModal } from '../modals/CreateChatModal.tsx';
import { useNavigate } from 'react-router-dom';

export const SidebarHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2 text-purple-700">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">ChatApp</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100"
            title="New Chat"
          >
            <Plus size={20} />
          </button>

          <div className="mx-1 h-6 w-px bg-slate-200" />

          <button
            onClick={handleLogout}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <CreateChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
