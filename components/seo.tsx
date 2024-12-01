import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
}

export default function SEO({ 
  title = "SRM University AP", 
  description = "Experience excellence in education at our state-of-the-art campus. Your journey to success begins here."
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
} 