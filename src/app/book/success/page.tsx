import type { Metadata } from 'next';

import SuccessClient from './SuccessClient';

// Transient confirmation page - keep it out of the index and canonicalize to itself
// (it was previously inheriting the root canonical "/").
export const metadata: Metadata = {
  title: 'Request Received - RRG Tech',
  description: 'Your project request has been received. Our team will be in touch within 24–48 hours.',
  alternates: { canonical: '/book/success' },
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <SuccessClient />;
}
