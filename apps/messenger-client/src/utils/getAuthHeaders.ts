import { useAuthStore } from '../store/auth.store';

export const getAuthHeaders = () => {
  const token = useAuthStore.getState().accessToken;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
