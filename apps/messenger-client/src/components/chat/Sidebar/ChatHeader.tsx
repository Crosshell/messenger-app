import { useState } from 'react';
import { LogOut, Plus, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../../store/auth.store';
import { CreateChatModal } from '../../modals/CreateChatModal';
import { useNavigate } from 'react-router-dom';

export const ChatHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2 text-purple-700">
          <MessageSquare className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">ChatApp</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title="New Chat"
          >
            <Plus size={20} />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          <button
            onClick={handleLogout}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
