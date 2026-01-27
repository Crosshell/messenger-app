import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response';
import type { ResendVerificationFormData } from '../validators/resend-verification';

interface UseResendVerificationProps {
  setError: UseFormSetError<ResendVerificationFormData>;
}

export const useResendVerification = ({
  setError,
}: UseResendVerificationProps) => {
  return useMutation<any, ApiErrorResponse, ResendVerificationFormData>({
    mutationFn: authService.resendVerification,
    onError: (error: ApiErrorResponse) => {
      if (typeof error.message === 'string') {
        setError('root', { type: 'server', message: error.message });
      } else if (Array.isArray(error.message)) {
        setError('root', { type: 'server', message: error.message[0] });
      }
    },
  });
};
