import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const serviceRef = doc(db, 'services', id)
    const serviceSnap = await getDoc(serviceRef)

    if (serviceSnap.exists()) {
      const service = serviceSnap.data()
      const title = service.title || service.name || 'Service'
      const description = service.description || service.details || `${title} in Ghana`
      const image = service.images?.[0] || service.image || null
      const location = service.location || 'Ghana'
      const category = service.category || 'Service'

      return {
        title: `${title} | ${category} in Ghana`,
        description: `${description.slice(0, 155)}${description.length > 155 ? '...' : ''} Hire ${title} in ${location}. Find trusted service providers on Huhu Ghana.`,
        openGraph: {
          title,
          description: description.slice(0, 200),
          url: `https://www.shops-huhu.com/service/${id}`,
          type: 'website',
          ...(image && {
            images: [{ url: image, width: 800, height: 600, alt: title }],
          }),
        },
        twitter: {
          card: image ? 'summary_large_image' : 'summary',
          title,
          description: description.slice(0, 200),
          ...(image && { images: [image] }),
        },
        alternates: {
          canonical: `https://www.shops-huhu.com/service/${id}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating service metadata:', error)
  }

  return {
    title: 'Service | Huhu Ghana',
    description: 'View service details on Huhu Ghana — find trusted service providers across Ghana.',
  }
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
