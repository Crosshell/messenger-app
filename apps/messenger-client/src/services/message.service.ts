import type { Message } from '../types/message.type';
import { api } from '../api/axios.ts';

export const messageService = {
  async getMessages(chatId: string): Promise<Message[]> {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },
};
