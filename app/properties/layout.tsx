import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties for Sale & Rent in Ghana | Houses, Apartments, Land',
  description: 'Find properties for sale and rent in Ghana. Browse houses, apartments, land, and commercial properties in Accra, Kumasi, and all regions. List your property for free.',
  keywords: ['property Ghana', 'houses for sale Ghana', 'apartments Ghana', 'land for sale Ghana', 'rent Ghana', 'real estate Ghana', 'Accra properties', 'Kumasi properties'],
  openGraph: {
    title: 'Properties for Sale & Rent in Ghana | Huhu Ghana',
    description: 'Find properties for sale and rent in Ghana. Houses, apartments, land, and commercial properties across all regions.',
    url: 'https://www.shops-huhu.com/properties',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shops-huhu.com/properties',
  },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
