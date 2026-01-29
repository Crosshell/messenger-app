import { Loader2, Search, User as UserIcon, X } from 'lucide-react';
import { Input } from '@ui/Input.tsx';
import { useSearchUsers } from '../../../user/hooks/use-search-users.ts';
import { useCreateChat } from '../../hooks/use-create-chat.ts';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateChatModal = ({ isOpen, onClose }: CreateChatModalProps) => {
  const { query, setQuery, users, isLoading } = useSearchUsers();
  const { mutate: createChat, isPending } = useCreateChat({
    onSuccess: onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">New Chat</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-slate-100"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="border-b p-4">
          <Input
            placeholder="Search users by username..."
            icon={<Search size={18} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <Loader2 className="mb-2 animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => createChat(user.id)}
                    disabled={isPending}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {user.username}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              {query.length < 3 ? (
                <span>Type at least 3 characters</span>
              ) : (
                <span>No users found</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
