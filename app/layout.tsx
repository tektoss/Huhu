import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from 'react-toastify';
import { ReduxProvider } from "@/lib/redux/provider"
import ModalProvider from "@/components/modals/modal-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shops-huhu.com'),
  title: {
    default: "Huhu - Buy and Sell in Ghana | Ghana's #1 Online Marketplace",
    template: "%s | Huhu Ghana"
  },
  description: "Ghana's largest online marketplace. Buy and sell cars, phones, electronics, fashion, properties, jobs, and services. Free listings, secure transactions, and millions of users across Ghana.",
  keywords: [
    "buy and sell Ghana",
    "online marketplace Ghana",
    "sell online Ghana",
    "buy online Ghana",
    "Ghana classifieds",
    "cars for sale Ghana",
    "phones for sale Ghana",
    "properties Ghana",
    "jobs Ghana",
    "electronics Ghana",
    "fashion Ghana",
    "Accra marketplace",
    "Kumasi marketplace",
    "Ghana shopping",
    "secondhand Ghana",
    "used items Ghana"
  ],
  authors: [{ name: "Huhu Ghana" }],
  creator: "Huhu Ghana",
  publisher: "Huhu Ghana",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://www.shops-huhu.com",
    siteName: "Huhu Ghana",
    title: "Huhu - Buy and Sell in Ghana | Ghana's #1 Online Marketplace",
    description: "Ghana's largest online marketplace. Buy and sell cars, phones, electronics, fashion, properties, jobs, and services. Free listings and secure transactions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Huhu - Ghana's Online Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Huhu - Buy and Sell in Ghana",
    description: "Ghana's largest online marketplace. Buy and sell anything - cars, phones, electronics, fashion, properties, jobs, and services.",
    images: ["/og-image.png"],
    creator: "@huhuGhana",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code
  },
  alternates: {
    canonical: "https://www.shops-huhu.com",
  },
  category: "shopping",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Huhu Ghana",
    "url": "https://www.shops-huhu.com",
    "description": "Ghana's largest online marketplace for buying and selling cars, phones, electronics, fashion, properties, jobs, and services.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.shops-huhu.com/search/{search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Huhu Ghana",
    "url": "https://www.shops-huhu.com",
    "logo": "https://www.shops-huhu.com/huhu-logo-dark.svg",
    "sameAs": [
      "https://www.facebook.com/huhuGhana",
      "https://twitter.com/huhuGhana",
      "https://www.instagram.com/huhuGhana"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "GH",
      "availableLanguage": "English"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7C3AED" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <ModalProvider />
          <ToastContainer /> 
        </ReduxProvider>
      </body>
    </html>
  )
}
