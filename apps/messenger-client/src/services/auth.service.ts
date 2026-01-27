import type { RegisterFormData } from '../validators/register';
import type { LoginFormData } from '../validators/login.ts';
import type { LoginResponse } from '../types/responses/login.response.ts';
import type { ForgotPasswordFormData } from '../validators/forgotPassword.ts';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async register(data: RegisterFormData) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || 'Internal Server Error',
      }));

      throw {
        ...errorData,
        statusCode: response.status,
      };
    }

    return response.json();
  },

  async verifyEmail(token: string) {
    const response = await fetch(`${API_URL}/api/auth/register/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || 'Internal Server Error',
      }));

      throw {
        ...errorData,
        statusCode: response.status,
      };
    }

    return response.json();
  },

  async login(data: LoginFormData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || 'Internal Server Error',
      }));

      throw {
        ...errorData,
        statusCode: response.status,
      };
    }

    return response.json();
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || 'Internal Server Error',
      }));

      throw {
        ...errorData,
        statusCode: response.status,
      };
    }

    return response.json();
  },
};
