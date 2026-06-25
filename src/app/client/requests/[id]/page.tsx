import { use } from 'react';
import { ClientRequestDetailContainer } from '@/containers/client/ClientRequestDetailContainer';

export default function ClientRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ClientRequestDetailContainer id={id} />;
}
