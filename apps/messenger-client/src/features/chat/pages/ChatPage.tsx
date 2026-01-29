import { LeftSidebar } from '../components/sidebar/LeftSidebar.tsx';
import { ActiveChat } from '../components/ActiveChat.tsx';
import { useChatEvents } from '../hooks/use-chat-events.ts';
import { ImagePreviewModal } from '@shared/modals/ImagePreviewModal.tsx';

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
