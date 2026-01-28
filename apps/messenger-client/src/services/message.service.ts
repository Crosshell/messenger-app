import type { Message } from '../types/message.type';
import { api } from '../api/axios';

export const messageService = {
  async getMessages(
    chatId: string,
    limit = 20,
    cursor?: string,
  ): Promise<Message[]> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) params.append('cursor', cursor);

    const response = await api.get(
      `/chats/${chatId}/messages?${params.toString()}`,
    );
    return response.data;
  },
};
