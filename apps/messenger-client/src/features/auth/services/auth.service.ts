import type { RegisterFormData } from '../model/validators/register.validator.ts';
import type { LoginFormData } from '../model/validators/login.validator.ts';
import type { LoginResponse } from '../model/types/responses/login.response.ts';
import type { ForgotPasswordFormData } from '../model/validators/forgot-password.validator.ts';
import type { ResetPasswordPayload } from '../model/validators/reset-password.validator.ts';
import type { ResendVerificationFormData } from '../model/validators/resend-verification.validator.ts';
import { api } from '@lib/axios.ts';
import type { MessageResponse } from '@shared/types/responses/message.response.ts';

export const authService = {
  async register(data: RegisterFormData) {
    const response = await api.post<MessageResponse>('/auth/register', data);
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post<MessageResponse>('/auth/register/verify', {
      token,
    });
    return response.data;
  },

  async login(data: LoginFormData) {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await api.post<MessageResponse>('/auth/logout');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const response = await api.post<MessageResponse>(
      '/auth/forgot-password',
      data,
    );
    return response.data;
  },

  async resetPassword(data: ResetPasswordPayload) {
    const response = await api.post<MessageResponse>(
      '/auth/reset-password',
      data,
    );
    return response.data;
  },

  async resendVerification(data: ResendVerificationFormData) {
    const response = await api.post<MessageResponse>(
      '/auth/register/verify/resend',
      data,
    );
    return response.data;
  },
};
