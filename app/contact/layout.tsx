import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Huhu Ghana',
  description: 'Get in touch with the Huhu Ghana team. We\'re here to help with any questions about buying, selling, or using our marketplace.',
  keywords: ['contact Huhu', 'Huhu support', 'help Huhu Ghana', 'customer service Ghana marketplace'],
  openGraph: {
    title: 'Contact Huhu Ghana',
    description: 'Get in touch with the Huhu Ghana team for support, feedback, or partnerships.',
    url: 'https://www.shops-huhu.com/contact',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shops-huhu.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
