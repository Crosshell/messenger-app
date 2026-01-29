import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service.ts';
import type { UseFormSetError } from 'react-hook-form';
import type { ForgotPasswordFormData } from '../model/validators/forgot-password.validator.ts';
import { handleApiError } from '@shared/utils/api-error.util.ts';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@shared/types/responses/error.response.ts';
import type { MessageResponse } from '@shared/types/responses/message.response.ts';

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
