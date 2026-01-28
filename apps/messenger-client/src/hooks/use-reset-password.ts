import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response';
import type {
  ResetPasswordFormData,
  ResetPasswordPayload,
} from '../validators/reset-password.validator';
import type { AxiosError } from 'axios';
import { handleApiError } from '../utils/api-error.util';
import type { MessageResponse } from '../types/responses/message.response';

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
