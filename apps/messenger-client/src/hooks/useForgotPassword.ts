import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response';
import type { ForgotPasswordFormData } from '../validators/forgotPassword';

interface UseForgotPasswordProps {
  setError: UseFormSetError<ForgotPasswordFormData>;
}

export const useForgotPassword = ({ setError }: UseForgotPasswordProps) => {
  return useMutation<any, ApiErrorResponse, ForgotPasswordFormData>({
    mutationFn: authService.forgotPassword,
    onError: (error: ApiErrorResponse) => {
      if (typeof error.message === 'string') {
        setError('root', { type: 'server', message: error.message });
      } else if (Array.isArray(error.message)) {
        setError('root', { type: 'server', message: error.message[0] });
      }
    },
  });
};
