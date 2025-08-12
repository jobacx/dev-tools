import { Metadata } from 'next';
import { getToolById } from '@/lib/tools-config';
import StructuredData from '@/components/structured-data';
import BcryptClient from './client';

const toolConfig = getToolById('bcrypt');

export const metadata: Metadata = {
  title: toolConfig?.seo.title,
  description: toolConfig?.seo.description,
  keywords: toolConfig?.seo.keywords,
  openGraph: {
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
    url: '/tools/bcrypt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
  },
  alternates: {
    canonical: '/tools/bcrypt',
  },
};

export default function BcryptPage() {
  return (
    <>
      <StructuredData type="tool" toolId="bcrypt" />
      <BcryptClient />
    </>
  );
}