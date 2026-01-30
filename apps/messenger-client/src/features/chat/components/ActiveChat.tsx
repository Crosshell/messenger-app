import { useAttachments } from '../hooks/use-attachments';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatRecipientHeader } from './ChatRecipientHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './message-input/MessageInput';
import { FileDropZone } from '@components/FileDropZone';
import { useActiveChatSelection } from '../hooks/use-active-chat-selection';

export const ActiveChat = () => {
  const { activeChat, activeChatId } = useActiveChatSelection();
  const attachmentState = useAttachments();

  if (!activeChatId || !activeChat) {
    return <ChatEmptyState />;
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-slate-50">
      <FileDropZone onFilesDrop={attachmentState.addFiles}>
        <ChatRecipientHeader chat={activeChat} />

        <MessageList chatId={activeChatId} />

        <MessageInput chatId={activeChatId} attachmentState={attachmentState} />
      </FileDropZone>
    </div>
  );
};
