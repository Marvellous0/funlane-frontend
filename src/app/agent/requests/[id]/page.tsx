import { use } from 'react';
import { AgentRequestDetailContainer } from '@/containers/agent/AgentRequestDetailContainer';

export default function AgentRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AgentRequestDetailContainer id={id} />;
}
