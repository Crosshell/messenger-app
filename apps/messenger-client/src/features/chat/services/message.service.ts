import type { Message } from '../model/types/message.type.ts';
import { api } from '@lib/axios.ts';

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
