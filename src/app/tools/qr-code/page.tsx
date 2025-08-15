import { Metadata } from 'next';
import { getToolById } from '@/lib/tools-config';
import StructuredData from '@/components/structured-data';
import QrCodeClient from './client';

const toolConfig = getToolById('qr-code');

export const metadata: Metadata = {
  title: toolConfig?.seo.title,
  description: toolConfig?.seo.description,
  keywords: toolConfig?.seo.keywords,
  openGraph: {
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
    url: '/tools/qr-code',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: toolConfig?.seo.title,
    description: toolConfig?.seo.description,
  },
  alternates: {
    canonical: '/tools/qr-code',
  },
};

export default function QrCodePage() {
  return (
    <>
      <StructuredData type="tool" toolId="qr-code" />
      <QrCodeClient />
    </>
  );
}
