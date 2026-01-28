import type { User } from './user.type';
import type { Message } from './message.type';

export interface ChatMember {
  user: User;
}

export interface Chat {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  members: ChatMember[];
  messages?: Message[];
  unreadCount: number;
}
