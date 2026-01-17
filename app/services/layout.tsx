import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services in Ghana | Find Local Service Providers',
  description: 'Find trusted service providers in Ghana. Browse home services, repairs, tutoring, photography, and more. Connect with professionals in Accra, Kumasi, and all regions.',
  keywords: ['services Ghana', 'home services Ghana', 'repair services Ghana', 'professionals Ghana', 'local services Accra', 'service providers Ghana'],
  openGraph: {
    title: 'Services in Ghana | Huhu Ghana',
    description: 'Find trusted service providers in Ghana. Home services, repairs, tutoring, photography, and more.',
    url: 'https://www.shops-huhu.com/services',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shops-huhu.com/services',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
