import { Metadata } from 'next';
import { getToolById } from '@/lib/tools-config';
import StructuredData from '@/components/structured-data';
import PasswordClient from './client';

const toolConfig = getToolById('password');

export const metadata: Metadata = {
  title: toolConfig?.seo.title,
  description: toolConfig?.seo.description,
  keywords: toolConfig?.seo.keywords,
  openGraph: {
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
    url: '/tools/password',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
  },
  alternates: {
    canonical: '/tools/password',
  },
};

export default function PasswordPage() {
  return (
    <>
      <StructuredData type="tool" toolId="password" />
      <PasswordClient />
    </>
  );
}