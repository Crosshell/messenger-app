import type { Chat } from '../types/chat.type';
import { api } from '../api/axios';
import type { PaginatedResponse } from '../types/responses/paginated.response.ts';

export const chatService = {
  async getUserChats(cursor?: string): Promise<PaginatedResponse<Chat>> {
    const params = new URLSearchParams({ limit: '20' });
    if (cursor) params.append('cursor', cursor);

    const response = await api.get<PaginatedResponse<Chat>>(
      `/chats?${params.toString()}`,
    );
    return response.data;
  },

  async createChat(targetUserId: string): Promise<Chat> {
    const response = await api.post('/chats', { targetUserId });
    return response.data;
  },
};
