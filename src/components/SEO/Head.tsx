import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

const defaultSEO = {
  title: 'PolishPop | Nail Art Terbaik di Indonesia',
  description: 'Temukan koleksi nail art terlengkap dan terkini. Desain kuku profesional dengan harga terjangkau. Pengiriman ke seluruh Indonesia.',
  keywords: [
    'nail art indonesia',
    'kuku palsu custom',
    'press on nails',
    'nail art jakarta',
    'desain kuku',
    'press on nails indonesia',
    'kuku palsu premium',
    'nail art murah',
    'jasa nail art',
    'kuku palsu cantik',
    'press on nails murah',
    'nail art kekinian',
    'manicure jakarta',
    'nail art bandung',
    'nail art surabaya'
  ],
  image: '/og-image.jpg',
  url: 'https://polishpop.art',
  type: 'website' as const
};

export function SEOHead({ 
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = defaultSEO.type,
  publishedAt,
  modifiedAt,
  author,
  price,
  availability
}: SEOProps) {
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  const logoUrl = `${url}/logo.png`;

  // Base schema
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type === 'product' ? 'Product' : 'WebSite',
    "name": title,
    "description": description,
    "url": url,
    "image": fullImageUrl,
    "logo": logoUrl
  };

  // Add product specific schema
  const productSchema = type === 'product' && price ? {
    ...baseSchema,
    "offers": {
      "@type": "Offer",
      "price": price.amount,
      "priceCurrency": price.currency,
      "availability": `https://schema.org/${availability || 'InStock'}`
    }
  } : baseSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author || 'PolishPop'} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#FB85AC" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="PolishPop" />
      <meta property="og:locale" content="id_ID" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* Apple Specific */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="PolishPop" />
      <link rel="apple-touch-icon" href={`${url}/logo192.png`} />

      {/* Links */}
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />

      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          ...productSchema,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "ID"
          },
          "priceRange": "Rp50.000 - Rp500.000",
          "sameAs": [
            "https://facebook.com/polishpop",
            "https://instagram.com/polishpop.id",
            "https://tiktok.com/@polishpop"
          ]
        })}
      </script>
    </Helmet>
  );
} 