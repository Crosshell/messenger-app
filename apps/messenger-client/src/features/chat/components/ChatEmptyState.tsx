import { MessageSquareDashed } from 'lucide-react';

export const ChatEmptyState = () => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center bg-slate-50 p-8 text-center text-slate-400">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
        <MessageSquareDashed size={40} className="text-purple-300" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-slate-700">
        Your Messages
      </h3>
      <p className="mx-auto max-w-xs">
        Select a chat from the sidebar to start messaging or create a new
        conversation
      </p>
    </div>
  );
};
