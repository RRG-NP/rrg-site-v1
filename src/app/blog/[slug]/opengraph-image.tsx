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

/** Embed Montserrat so the card matches the site type and the title renders truly bold. */
async function loadFont(weight: 400 | 600 | 800): Promise<Buffer | null> {
  try {
    return await readFile(join(process.cwd(), 'public', 'fonts', `Montserrat-${weight}.ttf`));
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
  const category = post?.category ?? 'Article';
  const readingTime = post?.readingTime ?? '';
  const author = post?.author ?? siteConfig.blogAuthor.name;

  const [logoSrc, regular, semibold, extrabold] = await Promise.all([
    loadLogo(),
    loadFont(400),
    loadFont(600),
    loadFont(800),
  ]);

  // Scale the headline so long titles stay on a few balanced lines.
  const titleSize = title.length > 78 ? 52 : title.length > 52 ? 62 : 74;

  const fonts = [
    regular && { name: 'Montserrat', data: regular, weight: 400 as const, style: 'normal' as const },
    semibold && { name: 'Montserrat', data: semibold, weight: 600 as const, style: 'normal' as const },
    extrabold && { name: 'Montserrat', data: extrabold, weight: 800 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: Buffer; weight: 400 | 600 | 800; style: 'normal' }[];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#141218',
          backgroundImage:
            'radial-gradient(1100px circle at 12% -10%, rgba(204,194,220,0.20), transparent 42%), radial-gradient(900px circle at 110% 120%, rgba(132,118,168,0.28), transparent 46%)',
          color: '#E6E0E9',
          fontFamily: 'Montserrat',
          position: 'relative',
        }}
      >
        {/* Top accent rule */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #CCC2DC 0%, #847AA8 55%, rgba(132,118,168,0) 100%)',
          }}
        />

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} width={60} height={60} alt="" style={{ borderRadius: '50%' }} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: '#CCC2DC',
                  color: '#141218',
                  fontSize: '30px',
                  fontWeight: 800,
                }}
              >
                R
              </div>
            )}
            <div style={{ display: 'flex', fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              {siteConfig.name}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 22px',
              borderRadius: '999px',
              border: '1px solid rgba(204,194,220,0.45)',
              backgroundColor: 'rgba(204,194,220,0.10)',
              fontSize: '20px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '3px',
              color: '#CCC2DC',
            }}
          >
            {category}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-1px',
              maxWidth: '1010px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              width: '120px',
              height: '6px',
              borderRadius: '999px',
              backgroundColor: '#CCC2DC',
            }}
          />
        </div>

        {/* Footer meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(230,224,233,0.12)',
            paddingTop: '28px',
            fontSize: '24px',
            color: '#B7AFC4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontWeight: 600, color: '#E6E0E9' }}>{author}</span>
            {readingTime && (
              <>
                <span style={{ color: '#5A5368' }}>•</span>
                <span>{readingTime}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', fontWeight: 600, color: '#CCC2DC' }}>
            {siteConfig.url.replace('https://', '')}
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length ? { fonts } : {}) },
  );
}
