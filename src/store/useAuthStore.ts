import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/interface';
import { AUTH_STORE_KEY } from '@/lib/constants';
import { setAuthCookie, clearAuthCookie } from '@/lib/cookies';
import { getToken, setToken, clearToken } from '@/lib/token';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  login: (user: AuthUser, token: string) => void;
  updateUser: (patch: Partial<Pick<AuthUser, 'name'>>) => void;
  logout: () => void;
  setHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      login: (user, token) => {
        setAuthCookie(user);
        setToken(token);
        set({ user, token });
      },
      updateUser: (patch) =>
        set((s) => {
          if (!s.user) return {};
          const user = { ...s.user, ...patch };
          setAuthCookie(user);
          return { user };
        }),
      logout: () => {
        clearAuthCookie();
        clearToken();
        set({ user: null, token: null });
      },
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: AUTH_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only the principal is persisted here; the JWT lives under its own key
      // (lib/token) so the HTTP client can read it synchronously.
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          // Re-sync the middleware cookie and pull the token back into state.
          setAuthCookie(state.user);
          state.token = getToken();
        }
        state?.setHydrated(true);
      },
    },
  ),
);
