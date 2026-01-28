import type { User } from '../types/user.type.ts';

import { api } from '../api/axios.ts';

export const userService = {
  async searchUsers(username: string): Promise<User[]> {
    const params = new URLSearchParams({ username });
    const response = await api.get(`/users?${params}`);
    return response.data;
  },
};
