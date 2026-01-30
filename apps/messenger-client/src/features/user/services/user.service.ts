import type { User } from '../model/types/user.type.ts';
import { api } from '@lib/axios.ts';
import type { PaginatedResponse } from '@shared/types/responses/paginated.response.ts';
import type { UpdateUserPayload } from '@features/user/model/types/update-user-payload.type';

export const userService = {
  async searchUsers(
    username: string,
    page = 1,
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      username,
      page: page.toString(),
      limit: '20',
    });
    const response = await api.get<PaginatedResponse<User>>(`/users?${params}`);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(data: UpdateUserPayload): Promise<User> {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },
};
