import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Credentials, RegisterPayload, Role } from '@/interface';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi, ApiError } from '@/api';
import { homePathFor, toAuthUser } from '@/services/auth.service';
import { toast } from 'react-toastify'

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(creds: Credentials): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      const { user: publicUser, token } = await authApi.login({
        email: creds.email.trim(),
        password: creds.password,
      });
      const authUser = toAuthUser(publicUser);
      login(authUser, token);
      router.replace(homePathFor(authUser.role));
      return true;
    } catch (err) {
      const e = err as ApiError;
      // 403 = account exists but email isn't verified yet. Send them to the
      // verification screen pre-filled so they can finish or resend.
      if (e instanceof ApiError && e.status === 403) {
        router.push(`/verify?email=${encodeURIComponent(creds.email.trim())}`);
        return false;
      }
      toast.error(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    logout();
    router.replace('/login');
  }

  function requireRole(role: Role): boolean {
    return user?.role === role;
  }

  /** Create a new account. Resolves to the API message; throws `ApiError`. */
  async function register(payload: RegisterPayload) {
    return authApi.register(payload);
  }

  /** Confirm an account with the emailed token. Throws `ApiError` on failure. */
  async function verifyEmail(token: string) {
    return authApi.verifyEmail(token);
  }

  async function resendVerification(email: string) {
    return authApi.resendVerification(email);
  }

  async function forgotPassword(email: string) {
    return authApi.forgotPassword(email);
  }

  async function resetPassword(token: string, newPassword: string) {
    return authApi.resetPassword(token, newPassword);
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    requireRole,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  };
}
