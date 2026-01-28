import type { RegisterFormData } from '../validators/register.validator.ts';
import type { LoginFormData } from '../validators/login.validator.ts';
import type { LoginResponse } from '../types/responses/login.response.ts';
import type { ForgotPasswordFormData } from '../validators/forgot-password.validator.ts';
import type { ResetPasswordPayload } from '../validators/reset-password.validator.ts';
import type { ResendVerificationFormData } from '../validators/resend-verification.validator.ts';
import { api } from '../api/axios.ts';
import type { MessageResponse } from '../types/responses/message.response.ts';

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
