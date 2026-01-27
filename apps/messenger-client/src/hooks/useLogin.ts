import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response.ts';
import type { LoginFormData } from '../validators/login.ts';
import { useAuthStore } from '../store/auth.store.ts';
import type { LoginResponse } from '../types/responses/login.response.ts';

interface UseLoginProps {
  setError: UseFormSetError<LoginFormData>;
  onSuccess?: () => void;
}

export const useLogin = ({ setError, onSuccess }: UseLoginProps) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation<LoginResponse, ApiErrorResponse, LoginFormData>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      onSuccess?.();
    },
    onError: (error: ApiErrorResponse) => {
      if (typeof error.message === 'string') {
        setError('root', { type: 'server', message: error.message });
      } else if (Array.isArray(error.message)) {
        setError('root', { type: 'server', message: error.message[0] });
      }
    },
  });
};
