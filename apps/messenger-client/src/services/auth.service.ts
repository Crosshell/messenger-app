import type { RegisterFormData } from '../validators/register.validator.ts';
import type { LoginFormData } from '../validators/login.validator.ts';
import type { LoginResponse } from '../types/responses/login.response.ts';
import type { ForgotPasswordFormData } from '../validators/forgot-password.validator.ts';
import type { ResetPasswordPayload } from '../validators/reset-password.validator.ts';
import type { ResendVerificationFormData } from '../validators/resend-verification.validator.ts';
import { api } from '../api/axios.ts';

export const authService = {
  async register(data: RegisterFormData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post('/auth/register/verify', { token });
    return response.data;
  },

  async login(data: LoginFormData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordPayload) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async resendVerification(data: ResendVerificationFormData) {
    const response = await api.post('/auth/register/verify/resend', data);
    return response.data;
  },
};
