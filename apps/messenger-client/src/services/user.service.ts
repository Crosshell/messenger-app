import type { User } from '../types/user.type';
import { api } from '../api/axios';
import type { PaginatedResponse } from '../types/responses/paginated.response.ts';

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
};
