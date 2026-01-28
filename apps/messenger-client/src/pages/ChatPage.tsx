import { LeftSidebar } from '../components/chat/Sidebar/LeftSidebar';
import { ActiveChat } from '../components/chat/ActiveChat';
import { useChatEvents } from '../hooks/use-chat-events';

export const ChatPage = () => {
  useChatEvents();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftSidebar />
      <ActiveChat />
    </div>
  );
};
