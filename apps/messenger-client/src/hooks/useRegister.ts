import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { RegisterFormData } from '../validators/register';
import type { ApiErrorResponse } from '../types/responses/error.response.ts';

interface UseRegisterProps {
  setError: UseFormSetError<RegisterFormData>;
}

export const useRegister = ({ setError }: UseRegisterProps) => {
  return useMutation<any, ApiErrorResponse, RegisterFormData>({
    mutationFn: authService.register,
    onError: (error: ApiErrorResponse) => {
      if (typeof error.message === 'string') {
        setError('root', { type: 'server', message: error.message });
      } else if (Array.isArray(error.message)) {
        setError('root', { type: 'server', message: error.message[0] });
      }
    },
  });
};
