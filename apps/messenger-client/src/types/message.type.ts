import type { User } from './user.type.ts';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  chatId: string;
  isRead: boolean;
  isEdited: boolean;
  sender?: User;
}
