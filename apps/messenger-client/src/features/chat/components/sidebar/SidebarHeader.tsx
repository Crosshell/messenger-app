import { LogOut, Plus, User as UserIcon, Settings } from 'lucide-react';
import { CreateChatModal } from '../modals/CreateChatModal';
import { EditProfileModal } from '@features/user/components/modals/EditProfileModal';
import { useSidebarHeader } from '../../hooks/use-sidebar-header';

export const SidebarHeader = () => {
  const { currentUser, isLoading, modals, handleLogout } = useSidebarHeader();

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <button
          onClick={() => modals.setProfileOpen(true)}
          className="group flex items-center gap-3 rounded-lg py-1 pr-2 transition-all hover:bg-slate-50"
          title="Edit Profile"
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-purple-100 text-purple-600 transition-transform group-hover:scale-105">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon size={18} />
              )}
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-slate-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <Settings size={10} />
            </div>
          </div>

          <div className="flex flex-col items-start">
            <span className="max-w-30 truncate text-sm font-bold tracking-tight text-slate-700 group-hover:text-purple-700">
              {isLoading ? '...' : currentUser?.username || 'User'}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => modals.setCreateOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-purple-600"
            title="New Chat"
          >
            <Plus size={20} />
          </button>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <CreateChatModal
        isOpen={modals.isCreateOpen}
        onClose={() => modals.setCreateOpen(false)}
      />

      {currentUser && (
        <EditProfileModal
          isOpen={modals.isProfileOpen}
          onClose={() => modals.setProfileOpen(false)}
          currentUser={currentUser}
        />
      )}
    </>
  );
};
