import { authService } from '../services/auth.service';
import type { ApiErrorResponse } from '../types/api';
import { useQuery } from '@tanstack/react-query';

export const useVerifyEmail = (token: string) => {
  return useQuery<any, ApiErrorResponse>({
    queryKey: ['verifyEmail', token],
    queryFn: () => authService.verifyEmail(token),
    enabled: !!token,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
};
