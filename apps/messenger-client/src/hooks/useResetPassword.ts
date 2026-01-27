import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response';
import type {
  ResetPasswordFormData,
  ResetPasswordPayload,
} from '../validators/resetPassword';

interface UseResetPasswordProps {
  setError: UseFormSetError<ResetPasswordFormData>;
}

export const useResetPassword = ({ setError }: UseResetPasswordProps) => {
  return useMutation<any, ApiErrorResponse, ResetPasswordPayload>({
    mutationFn: authService.resetPassword,
    onError: (error: ApiErrorResponse) => {
      if (typeof error.message === 'string') {
        setError('root', { type: 'server', message: error.message });
      } else if (Array.isArray(error.message)) {
        setError('root', { type: 'server', message: error.message[0] });
      }
    },
  });
};
