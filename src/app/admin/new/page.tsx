import { NewRequestContainer } from '@/containers/client/NewRequestContainer';

/**
 * Admin: create a travel request for end-to-end testing. The request is owned
 * by the admin account, so the admin can also approve/reject it as the client
 * from the lifecycle console.
 */
export default function AdminNewRequestPage() {
  return <NewRequestContainer redirectTo="/admin/requests" />;
}
