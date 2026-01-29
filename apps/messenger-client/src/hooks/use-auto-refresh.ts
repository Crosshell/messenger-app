import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../store/auth.store';
import { api } from '../api/axios';

interface JwtPayload {
  exp: number;
}

export const useAutoRefresh = () => {
  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const expTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expTime - currentTime;

      const refreshDelay = timeLeft - 60000;

      const timeoutId = setTimeout(
        async () => {
          try {
            const { data } = await api.post('/auth/refresh');
            setAccessToken(data.accessToken);
          } catch (error) {
            console.error('Failed to auto-refresh token', error);
          }
        },
        Math.max(0, refreshDelay),
      );

      return () => clearTimeout(timeoutId);
    } catch (e) {
      console.error('Invalid token format', e);
    }
  }, [accessToken, setAccessToken]);
};
