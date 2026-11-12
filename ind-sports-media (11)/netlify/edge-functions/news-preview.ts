// Netlify Edge Function: gives each /news/{slug} link its own social preview card.
//
// X, Facebook, iMessage, etc. don't run JavaScript, so without this every shared
// story would show the generic site card. This runs on Netlify before the page is
// sent, looks the story up in Firestore, and swaps in its headline, summary and photo.
// If anything fails it simply serves the normal page.

import type { Context } from 'https://edge.netlify.com';

const PROJECT_ID = 'pelagic-airline-s1ttq';
const SITE = 'https://indsports.media';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setMeta(html: string, prop: string, value: string): string {
  const attr = prop.startsWith('og:') ? 'property' : 'name';
  const tag = `<meta ${attr}="${prop}" content="${esc(value)}" />`;
  const re = new RegExp(`<meta ${attr}="${prop.replace(/[.:]/g, '\\$&')}"[^>]*>`);
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

export default async (request: Request, context: Context) => {
  const response = await context.next();
  try {
    const slug = decodeURIComponent(new URL(request.url).pathname.split('/')[2] || '');
    if (!slug || !/^[\w-]{1,128}$/.test(slug)) return response;

    const api = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/articles/${slug}`;
    const res = await fetch(api, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return response; // missing or not published

    const f = (await res.json()).fields || {};
    const str = (k: string) => (f[k]?.stringValue as string | undefined) || '';
    if (str('status') !== 'published') return response;

    const isLive = f.isLive?.booleanValue === true;
    const title = `${isLive ? 'LIVE: ' : ''}${str('title')}`;
    const description = str('excerpt') || 'Live coverage from IND Sports Media.';
    const image = str('coverType') === 'video' || !str('coverUrl') ? `${SITE}/logo.png` : str('coverUrl');
    const url = `${SITE}/news/${slug}`;

    let html = await response.text();
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)} | IND Sports Media</title>`);
    html = setMeta(html, 'description', description);
    html = setMeta(html, 'og:type', 'article');
    html = setMeta(html, 'og:title', title);
    html = setMeta(html, 'og:description', description);
    html = setMeta(html, 'og:image', image);
    html = setMeta(html, 'og:url', url);
    html = setMeta(html, 'twitter:card', 'summary_large_image');

    // Structured data: tells Google this page is a news story (helps with Top Stories / news results).
    const ts = (k: string) => (f[k]?.timestampValue as string | undefined) || undefined;
    const published = ts('publishedAt') || ts('createdAt');
    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: str('title').slice(0, 110),
      description,
      image: [image],
      mainEntityOfPage: url,
      articleSection: str('sport') || undefined,
      datePublished: published,
      dateModified: ts('updatedAt') || published,
      author: str('authorName') ? [{ '@type': 'Person', name: str('authorName') }] : undefined,
      publisher: {
        '@type': 'NewsMediaOrganization',
        name: 'IND Sports Media',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
      },
    };
    const ld = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `    <script type="application/ld+json">${ld}</script>\n  </head>`);

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    // Short cache so headline edits show up on new shares quickly.
    headers.set('cache-control', 'public, max-age=0, s-maxage=60');
    return new Response(html, { status: response.status, headers });
  } catch {
    return response;
  }
};

export const config = { path: '/news/*' };
