import { redirect } from 'next/navigation';

/**
 * Entry point. Middleware redirects authenticated users straight to their
 * dashboard; everyone else lands on the login screen.
 */
export default function HomePage() {
  redirect('/login');
}
