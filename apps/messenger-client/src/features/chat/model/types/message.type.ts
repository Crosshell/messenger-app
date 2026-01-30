import type { User } from '../../../user/model/types/user.type.ts';
import type { Attachment } from './attachment.type.ts';

export interface Message {
  id: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  chatId: string;
  isRead: boolean;
  isEdited: boolean;
  sender?: User;
  attachments?: Attachment[];
  replyToId?: string;
  replyTo?: {
    id: string;
    content?: string;
    senderId: string;
    sender: { username: string };
    attachments?: { id: string; mimeType?: string }[];
  };
}
