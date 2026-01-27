import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response';
import type { ResendVerificationFormData } from '../validators/resend-verification.validator.ts';
import type { AxiosError } from 'axios';
import { handleApiError } from '../utils/api-error.util.ts';
import type { MessageResponse } from '../types/responses/message.response.ts';

interface UseResendVerificationProps {
  setError: UseFormSetError<ResendVerificationFormData>;
}

export const useResendVerification = ({
  setError,
}: UseResendVerificationProps) => {
  return useMutation<
    MessageResponse,
    AxiosError<ApiErrorResponse>,
    ResendVerificationFormData
  >({
    mutationFn: authService.resendVerification,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      handleApiError(error, setError);
    },
  });
};
