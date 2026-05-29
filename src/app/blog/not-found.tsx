import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/** Shown for unknown /blog/* URLs (and when a post calls notFound()). */
export default function BlogNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-text-1 sm:text-4xl">Article not found</h1>
      <p className="mt-4 text-text-1/60">
        The post you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-stroke px-6 py-2.5 text-sm font-medium text-text-1 transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to the blog
      </Link>
    </div>
  );
}
