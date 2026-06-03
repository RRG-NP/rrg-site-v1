import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import MDXContent from '@/components/blog/mdx/MDXContent';
import TableOfContents from '@/components/blog/TableOfContents';
import ReadingProgress from '@/components/blog/ReadingProgress';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import PostMeta from '@/components/blog/PostMeta';
import TagBadge from '@/components/blog/TagBadge';
import PrevNextNav from '@/components/blog/PrevNextNav';
import RelatedPosts from '@/components/blog/RelatedPosts';

import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
  getPostHeadings,
  getRelatedPosts,
  toSummary,
} from '@/lib/blog';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPostMetadata,
  type FaqItem,
} from '@/lib/seo';

import '@/shared/styles/blog.scss';

// Rebuild on a schedule so edits/new posts appear without a manual deploy.
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const headings = getPostHeadings(post);
  const { previous, next } = getAdjacentPosts(post.slug);
  const related = getRelatedPosts(post).map(toSummary);

  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: post.url },
  ]);
  const faqJsonLd = buildFaqJsonLd((post.faq as FaqItem[] | undefined) ?? []);

  return (
    <>
      <ReadingProgress />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
        <Breadcrumbs
          className="mb-8"
          items={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title },
          ]}
        />

        <article>
          <header>
            {post.category && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{post.category}</p>
            )}
            <h1 className="text-3xl font-extrabold leading-tight text-text-1 sm:text-4xl lg:text-[2.75rem]">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-text-1/60">{post.description}</p>
            <PostMeta className="mt-5" author={post.author} date={post.date} readingTime={post.readingTime} />
            {post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} />
                ))}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-gray-1">
              <Image
                src={post.coverImage}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-12 gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="prose-rrg mx-auto w-full px-2">
              <MDXContent code={post.body.code} />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          </div>
        </article>

        <div className="mt-16 space-y-16">
          <PrevNextNav previous={previous ? toSummary(previous) : null} next={next ? toSummary(next) : null} />
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-1 pt-12">
            <RelatedPosts posts={related} />
          </div>
        )}
      </div>
    </>
  );
}
