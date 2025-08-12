import { Metadata } from 'next';
import { getToolById } from '@/lib/tools-config';
import StructuredData from '@/components/structured-data';
import LoremClient from './client';

const toolConfig = getToolById('lorem');

export const metadata: Metadata = {
  title: toolConfig?.seo.title,
  description: toolConfig?.seo.description,
  keywords: toolConfig?.seo.keywords,
  openGraph: {
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
    url: '/tools/lorem',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
  },
  alternates: {
    canonical: '/tools/lorem',
  },
};

export default function LoremPage() {
  return (
    <>
      <StructuredData type="tool" toolId="lorem" />
      <LoremClient />
    </>
  );
}
