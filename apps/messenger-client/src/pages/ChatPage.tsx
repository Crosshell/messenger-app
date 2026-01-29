import { LeftSidebar } from '../components/chat/Sidebar/LeftSidebar';
import { ActiveChat } from '../components/chat/ActiveChat';
import { useChatEvents } from '../hooks/use-chat-events';
import { ImagePreviewModal } from '../components/modals/ImagePreviewModal.tsx';

export const ChatPage = () => {
  useChatEvents();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <LeftSidebar />
      <ActiveChat />
      <ImagePreviewModal />
    </div>
  );
};
