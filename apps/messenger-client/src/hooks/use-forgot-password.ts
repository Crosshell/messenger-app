import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { ForgotPasswordFormData } from '../validators/forgot-password.validator';
import { handleApiError } from '../utils/api-error.util';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/responses/error.response';
import type { MessageResponse } from '../types/responses/message.response';

interface UseForgotPasswordProps {
  setError: UseFormSetError<ForgotPasswordFormData>;
}

export const useForgotPassword = ({ setError }: UseForgotPasswordProps) => {
  return useMutation<
    MessageResponse,
    AxiosError<ApiErrorResponse>,
    ForgotPasswordFormData
  >({
    mutationFn: authService.forgotPassword,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      handleApiError(error, setError);
    },
  });
};
