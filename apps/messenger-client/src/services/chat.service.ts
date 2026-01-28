import type { Chat } from '../types/chat.type.ts';
import { api } from '../api/axios.ts';

export const chatService = {
  async getUserChats(): Promise<Chat[]> {
    const response = await api.get('/chats');
    return response.data;
  },

  async createChat(targetUserId: string): Promise<Chat> {
    const response = await api.post('/chats', { targetUserId });
    return response.data;
  },
};
