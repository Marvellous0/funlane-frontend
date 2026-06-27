import { AdminUserDetailContainer } from '@/containers/admin/AdminUserDetailContainer';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserDetailContainer id={id} />;
}
