import type { Chat } from '../model/types/chat.type.ts';
import { api } from '@lib/axios.ts';
import type { PaginatedResponse } from '@shared/types/responses/paginated.response.ts';
import type { DeleteChatResponse } from '@features/chat/model/types/responses/delete-сhat.response';

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

  async deleteChat(chatId: string): Promise<DeleteChatResponse> {
    const response = await api.delete<DeleteChatResponse>(`/chats/${chatId}`);
    return response.data;
  },
};
