import { Metadata } from 'next';
import { getToolById } from '@/lib/tools-config';
import StructuredData from '@/components/structured-data';
import GoogleDriveClient from './client';

const toolConfig = getToolById('google-drive');

export const metadata: Metadata = {
  title: toolConfig?.seo.title,
  description: toolConfig?.seo.description,
  keywords: toolConfig?.seo.keywords,
  openGraph: {
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
    url: '/tools/google-drive',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
  },
  alternates: {
    canonical: '/tools/google-drive',
  },
};

export default function GoogleDrivePage() {
  return (
    <>
      <StructuredData type="tool" toolId="google-drive" />
      <GoogleDriveClient />
    </>
  );
}