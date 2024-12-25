import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: string
  keywords?: string[]
  author?: string
  twitterHandle?: string
  noIndex?: boolean
}

export default function SEO({ 
  title = "SRM University AP", 
  description = "Experience excellence in education at our state-of-the-art campus. Your journey to success begins here.",
  image = "https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png",
  type = "website",
  keywords = ["SRM AP", "university", "education", "engineering", "campus", "college"],
  author = "SRM University AP",
  twitterHandle = "@SRMAP_Official",
  noIndex = false
}: SEOProps) {
  const siteUrl = "https://srmap.edu.in";
  const fullTitle = `${title}${title === "SRM University AP" ? "" : " | SRM University AP"}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="SRM University AP" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/icons/favicon.ico" />
      <link rel="apple-touch-icon" href="/icons/ios/ios-appicon-180-180.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="SRM AP Connect" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
    </Head>
  )
} 