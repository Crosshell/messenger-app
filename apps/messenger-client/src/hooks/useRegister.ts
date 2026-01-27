import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { RegisterFormData } from '../validators/register';
import type { ApiErrorResponse } from '../types/api.ts';

interface UseRegisterProps {
  onSuccess?: () => void;
  setError: UseFormSetError<RegisterFormData>;
}

export const useRegister = ({ onSuccess, setError }: UseRegisterProps) => {
  return useMutation<any, ApiErrorResponse, RegisterFormData>({
    mutationFn: authService.register,
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: ApiErrorResponse) => {
      if (typeof error.message === 'string') {
        setError('root', { type: 'server', message: error.message });
      }

      if (Array.isArray(error.message)) {
        setError('root', { type: 'server', message: error.message[0] });
      }
    },
  });
};
