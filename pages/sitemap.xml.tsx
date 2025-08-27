import { GetServerSideProps } from 'next';

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brainstackeducation.in';
  
  const pages = [
    '',
    '/materials',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `;
    })
    .join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap; 