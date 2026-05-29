import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

/** Read the logo from /public and inline it as a data URI (satori can't use relative paths). */
async function loadLogo(): Promise<string | null> {
  try {
    const data = await readFile(join(process.cwd(), 'public', siteConfig.logo));
    return `data:image/png;base64,${data.toString('base64')}`;
  } catch {
    return null;
  }
}

export const alt = 'RRG Tech blog article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** Branded 1200x630 social card generated per post (palette-matched to the site). */
export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? siteConfig.name;
  const category = post?.category ?? 'Blog';
  const readingTime = post?.readingTime ?? '';
  const logoSrc = await loadLogo();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#141218',
          backgroundImage:
            'radial-gradient(900px circle at 15% 0%, rgba(204,194,220,0.18), transparent 45%), radial-gradient(700px circle at 100% 100%, rgba(74,68,88,0.5), transparent 40%)',
          color: '#E6E0E9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} width={56} height={56} alt="" style={{ borderRadius: '50%' }} />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#CCC2DC',
                color: '#141218',
                fontSize: '28px',
                fontWeight: 700,
              }}
            >
              R
            </div>
          )}
          <div style={{ display: 'flex', fontSize: '30px', fontWeight: 700 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '4px',
              color: '#CCC2DC',
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 60 ? '56px' : '68px',
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '26px', color: '#9a91a8' }}>
          <span>{siteConfig.url.replace('https://', '')}</span>
          {readingTime && (
            <>
              <span>·</span>
              <span>{readingTime}</span>
            </>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
