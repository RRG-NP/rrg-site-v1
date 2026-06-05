'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker (production only) once the page is idle, so it
 * never competes with the initial render. The SW itself is network-first for
 * navigations, so registering it can't make content go stale.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* Registration is best-effort; failure must never break the page. */
      });
    };

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);

  return null;
}
