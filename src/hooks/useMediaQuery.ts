'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. Returns `false` on the server and the first
 * client render, then resolves after mount — components that use it (e.g. the
 * Drawer) only render their result client-side, so there's no hydration flash.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
