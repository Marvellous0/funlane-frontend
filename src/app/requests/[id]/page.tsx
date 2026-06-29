import { RequestRedirectContainer } from '@/containers/RequestRedirectContainer';

/**
 * Role-agnostic deep link target (e.g. from notification emails). Resolves to
 * the appropriate role-scoped request detail page.
 */
export default async function RequestDeepLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestRedirectContainer id={id} />;
}
