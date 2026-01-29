import { MessageSquareDashed } from 'lucide-react';

export const ChatEmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center h-full">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
        <MessageSquareDashed size={40} className="text-purple-300" />
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        Your Messages
      </h3>
      <p className="max-w-xs mx-auto">
        Select a chat from the sidebar to start messaging or create a new
        conversation
      </p>
    </div>
  );
};
