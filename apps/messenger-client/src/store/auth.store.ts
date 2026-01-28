import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  sub: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      isAuthenticated: false,

      setAccessToken: (accessToken: string) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          set({
            accessToken,
            isAuthenticated: true,
            userId: decoded.sub,
          });
        } catch (e) {
          set({ accessToken: null, isAuthenticated: false, userId: null });
        }
      },

      logout: () => set({ accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
