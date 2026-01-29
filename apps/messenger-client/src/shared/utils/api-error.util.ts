import { AxiosError } from 'axios';
import type { UseFormSetError } from 'react-hook-form';
import type { ApiErrorResponse } from '../types/responses/error.response.ts';

export const handleApiError = <T extends Record<string, any>>(
  error: AxiosError<ApiErrorResponse>,
  setError: UseFormSetError<T>,
) => {
  const data = error.response?.data;

  if (!data) {
    setError('root', { message: 'Network error or server unavailable' });
    return;
  }

  const message = Array.isArray(data.message) ? data.message[0] : data.message;

  setError('root', { message });
};
