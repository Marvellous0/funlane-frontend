import { useCallback, useEffect, useState } from 'react';
import { usersApi, ApiError } from '@/api';
import type {
  AdminUserView,
  BackendRole,
  ListUsersParams,
  Pagination,
} from '@/interface';
import { toast } from 'react-toastify';

const errMsg = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

/** Live admin user directory + management actions against `/admin/users`. */
export function useUsers(initial: ListUsersParams = { page: 1, limit: 20 }) {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ListUsersParams>(initial);

  const load = useCallback(async (p: ListUsersParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersApi.listUsers(p);
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err) {
      setError(errMsg(err, 'Could not load users. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(params);
  }, [load, params]);

  const patchRow = (u: AdminUserView) =>
    setUsers((list) => list.map((x) => (x.id === u.id ? u : x)));

  const suspend = useCallback(async (id: string) => {
    try {
      const { user } = await usersApi.suspendUser(id);
      patchRow(user);
      toast.success(`${user.name} has been suspended.`);
    } catch (err) {
      toast.error(errMsg(err, 'Could not suspend the user.'));
    }
  }, []);

  const reactivate = useCallback(async (id: string) => {
    try {
      const { user } = await usersApi.reactivateUser(id);
      patchRow(user);
      toast.success(`${user.name} has been reactivated.`);
    } catch (err) {
      toast.error(errMsg(err, 'Could not reactivate the user.'));
    }
  }, []);

  const changeRole = useCallback(async (id: string, role: BackendRole) => {
    try {
      const { user } = await usersApi.changeUserRole(id, role);
      patchRow(user);
      toast.success(`${user.name} is now ${role.toLowerCase()}.`);
    } catch (err) {
      toast.error(errMsg(err, 'Could not change the role.'));
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await usersApi.deleteUser(id);
      setUsers((list) => list.filter((x) => x.id !== id));
      toast.success(res.message || 'User deleted.');
      return true;
    } catch (err) {
      toast.error(errMsg(err, 'Could not delete the user.'));
      return false;
    }
  }, []);

  return {
    users,
    pagination,
    loading,
    error,
    params,
    setParams,
    refresh: () => load(params),
    suspend,
    reactivate,
    changeRole,
    remove,
  };
}

/** Single admin user record + management actions for the detail page. */
export function useUser(id: string) {
  const [user, setUser] = useState<AdminUserView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { user: u } = await usersApi.getUser(id);
      setUser(u);
    } catch (err) {
      setError(errMsg(err, 'Could not load this user. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateProfile = useCallback(
    async (payload: { name?: string; phone?: string }): Promise<boolean> => {
      try {
        const { user: u } = await usersApi.updateUser(id, payload);
        setUser(u);
        toast.success('Profile updated.');
        return true;
      } catch (err) {
        toast.error(errMsg(err, 'Could not update the profile.'));
        return false;
      }
    },
    [id],
  );

  const suspend = useCallback(async () => {
    try {
      const { user: u } = await usersApi.suspendUser(id);
      setUser(u);
      toast.success(`${u.name} has been suspended.`);
    } catch (err) {
      toast.error(errMsg(err, 'Could not suspend the user.'));
    }
  }, [id]);

  const reactivate = useCallback(async () => {
    try {
      const { user: u } = await usersApi.reactivateUser(id);
      setUser(u);
      toast.success(`${u.name} has been reactivated.`);
    } catch (err) {
      toast.error(errMsg(err, 'Could not reactivate the user.'));
    }
  }, [id]);

  const changeRole = useCallback(
    async (role: BackendRole) => {
      try {
        const { user: u } = await usersApi.changeUserRole(id, role);
        setUser(u);
        toast.success(`${u.name} is now ${role.toLowerCase()}.`);
      } catch (err) {
        toast.error(errMsg(err, 'Could not change the role.'));
      }
    },
    [id],
  );

  const remove = useCallback(async (): Promise<boolean> => {
    try {
      const res = await usersApi.deleteUser(id);
      toast.success(res.message || 'User deleted.');
      return true;
    } catch (err) {
      toast.error(errMsg(err, 'Could not delete the user.'));
      return false;
    }
  }, [id]);

  return { user, loading, error, refresh: load, updateProfile, suspend, reactivate, changeRole, remove };
}
