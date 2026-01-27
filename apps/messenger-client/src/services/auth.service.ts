import type { RegisterFormData } from '../validators/register';

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
};
