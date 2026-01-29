import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.ts';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '@shared/types/responses/error.response.ts';
import type {
  ResetPasswordFormData,
  ResetPasswordPayload,
} from '../model/validators/reset-password.validator.ts';
import type { AxiosError } from 'axios';
import { handleApiError } from '@shared/utils/api-error.util.ts';
import type { MessageResponse } from '@shared/types/responses/message.response.ts';

interface UseResetPasswordProps {
  setError: UseFormSetError<ResetPasswordFormData>;
}

export const useResetPassword = ({ setError }: UseResetPasswordProps) => {
  return useMutation<
    MessageResponse,
    AxiosError<ApiErrorResponse>,
    ResetPasswordPayload
  >({
    mutationFn: authService.resetPassword,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      handleApiError(error, setError);
    },
  });
};
