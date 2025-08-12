import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Developer Tools - Essential Utilities for Developers",
    template: "%s | Dev Tools"
  },
  description: "Essential developer utilities for hashing, encoding, decoding, JWT tokens, password generation, and more. Fast, secure, and free online tools for developers.",
  keywords: ["developer tools", "bcrypt", "base64", "jwt", "password generator", "hash", "encode", "decode", "google drive", "online tools"],
  authors: [{ name: "Dev Tools" }],
  creator: "Dev Tools",
  publisher: "Dev Tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://devtools-jbacule.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Developer Tools - Essential Utilities for Developers",
    description: "Essential developer utilities for hashing, encoding, decoding, JWT tokens, password generation, and more. Fast, secure, and free online tools for developers.",
    url: '/',
    siteName: 'Dev Tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Developer Tools - Essential Utilities for Developers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Developer Tools - Essential Utilities for Developers",
    description: "Essential developer utilities for hashing, encoding, decoding, JWT tokens, password generation, and more.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dev Tools" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
