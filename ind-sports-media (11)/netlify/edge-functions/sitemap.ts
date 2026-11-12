// Netlify Edge Function: serves /sitemap.xml, the list Google uses to find every story.
//
// Built fresh from Firestore on each request (cached for 15 minutes), so new stories
// show up without a redeploy. Only published articles are listed. If Firestore can't
// be reached, the sitemap still lists the home page so Google never gets an error.

const PROJECT_ID = 'pelagic-airline-s1ttq';
const SITE = 'https://indsports.media';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Entry {
  loc: string;
  lastmod?: string;
}

async function publishedArticles(): Promise<Entry[]> {
  const api = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal: AbortSignal.timeout(4000),
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'articles' }],
        where: {
          fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'published' } },
        },
        select: { fields: [{ fieldPath: 'updatedAt' }, { fieldPath: 'publishedAt' }] },
        limit: 5000,
      },
    }),
  });
  if (!res.ok) return [];

  const rows = (await res.json()) as Array<{ document?: { name: string; fields?: Record<string, any> } }>;
  const entries: Entry[] = [];
  for (const row of rows) {
    const d = row.document;
    if (!d) continue;
    const slug = d.name.split('/').pop() || '';
    if (!/^[\w-]{1,128}$/.test(slug)) continue;
    const ts = d.fields?.updatedAt?.timestampValue || d.fields?.publishedAt?.timestampValue;
    entries.push({ loc: `${SITE}/news/${slug}`, lastmod: ts ? String(ts).slice(0, 10) : undefined });
  }
  entries.sort((a, b) => (b.lastmod || '').localeCompare(a.lastmod || ''));
  return entries;
}

export default async () => {
  let articles: Entry[] = [];
  try {
    articles = await publishedArticles();
  } catch {
    // Fall through with just the home page.
  }

  const urls = [{ loc: `${SITE}/` } as Entry, ...articles]
    .map(
      (e) =>
        `  <url>\n    <loc>${esc(e.loc)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=900',
    },
  });
};

export const config = { path: '/sitemap.xml' };
