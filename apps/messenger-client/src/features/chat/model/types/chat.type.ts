import type { User } from '../../../user/model/types/user.type.ts';
import type { Message } from './message.type.ts';

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
