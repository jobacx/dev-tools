import { toolsConfig } from '@/lib/tools-config';

interface StructuredDataProps {
  type: 'homepage' | 'tool';
  toolId?: string;
}

export default function StructuredData({ type, toolId }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://dev-tools.vercel.app';

  if (type === 'homepage') {
    const homepageData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Developer Tools",
      "alternateName": "Dev Tools",
      "url": baseUrl,
      "description": "Essential developer utilities for hashing, encoding, decoding, JWT tokens, password generation, and more. Fast, secure, and free online tools for developers.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Dev Tools"
      },
      "featureList": toolsConfig.map(tool => tool.title),
      "screenshot": `${baseUrl}/og-image.png`,
      "softwareVersion": "1.0",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageData) }}
      />
    );
  }

  if (type === 'tool' && toolId) {
    const tool = toolsConfig.find(t => t.id === toolId);
    if (!tool) return null;

    const toolData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.seo.title,
      "url": `${baseUrl}${tool.href}`,
      "description": tool.seo.description,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Dev Tools"
      },
      "isPartOf": {
        "@type": "WebSite",
        "name": "Developer Tools",
        "url": baseUrl
      },
      "potentialAction": {
        "@type": "UseAction",
        "target": `${baseUrl}${tool.href}`,
        "object": tool.seo.title
      }
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolData) }}
      />
    );
  }

  return null;
}
