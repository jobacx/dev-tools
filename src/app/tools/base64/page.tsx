import { Metadata } from 'next';
import { getToolById } from '@/lib/tools-config';
import StructuredData from '@/components/structured-data';
import Base64Client from './client';

const toolConfig = getToolById('base64');

export const metadata: Metadata = {
  title: toolConfig?.seo.title,
  description: toolConfig?.seo.description,
  keywords: toolConfig?.seo.keywords,
  openGraph: {
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
    url: '/tools/base64',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
  },
  alternates: {
    canonical: '/tools/base64',
  },
};

export default function Base64Page() {
  return (
    <>
      <StructuredData type="tool" toolId="base64" />
      <Base64Client />
    </>
  );
}