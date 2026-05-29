import BlogCard from './BlogCard';
import type { PostSummary } from '@/lib/blog';

/** "Related articles" grid shown beneath a post. */
export default function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-6 text-xl font-bold text-text-1 sm:text-2xl">
        Related articles
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
