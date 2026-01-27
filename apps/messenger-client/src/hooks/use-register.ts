import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { UseFormSetError } from 'react-hook-form';
import type { RegisterFormData } from '../validators/register.validator.ts';
import type { ApiErrorResponse } from '../types/responses/error.response.ts';
import type { AxiosError } from 'axios';
import { handleApiError } from '../utils/api-error.util.ts';
import type { MessageResponse } from '../types/responses/message.response.ts';

interface UseRegisterProps {
  setError: UseFormSetError<RegisterFormData>;
}

export const useRegister = ({ setError }: UseRegisterProps) => {
  return useMutation<
    MessageResponse,
    AxiosError<ApiErrorResponse>,
    RegisterFormData
  >({
    mutationFn: authService.register,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      handleApiError(error, setError);
    },
  });
};
