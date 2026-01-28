import { authService } from '../services/auth.service';
import type { ApiErrorResponse } from '../types/responses/error.response';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { MessageResponse } from '../types/responses/message.response';

export const useVerifyEmail = (token: string) => {
  return useQuery<MessageResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ['verifyEmail', token],
    queryFn: () => authService.verifyEmail(token),
    enabled: !!token,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
};
