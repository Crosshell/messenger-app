import { LeftSidebar } from '../components/chat/Sidebar/LeftSidebar.tsx';
import { ActiveChat } from '../components/chat/ActiveChat';
import { useChatEvents } from '../hooks/use-chat-events.ts';

export const ChatPage = () => {
  useChatEvents();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftSidebar />
      <ActiveChat />
    </div>
  );
};
