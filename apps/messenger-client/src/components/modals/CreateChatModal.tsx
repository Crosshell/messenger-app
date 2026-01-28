import { X, Search, Loader2, User as UserIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { useSearchUsers } from '../../hooks/use-search-users';
import { useCreateChat } from '../../hooks/use-create-chat';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">New Chat</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-4 border-b">
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
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 className="animate-spin mb-2" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => createChat(user.id)}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-full h-full rounded-full object-cover"
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
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
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
