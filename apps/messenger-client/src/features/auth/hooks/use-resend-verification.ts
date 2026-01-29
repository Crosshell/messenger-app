import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.ts';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '@shared/types/responses/error.response.ts';
import type { ResendVerificationFormData } from '../model/validators/resend-verification.validator.ts';
import type { AxiosError } from 'axios';
import { handleApiError } from '@shared/utils/api-error.util.ts';
import type { MessageResponse } from '@shared/types/responses/message.response.ts';

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
