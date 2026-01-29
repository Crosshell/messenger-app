import { authService } from '../services/auth.service.ts';
import type { ApiErrorResponse } from '@shared/types/responses/error.response.ts';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { MessageResponse } from '@shared/types/responses/message.response.ts';

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
