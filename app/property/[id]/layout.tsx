import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  try {
    const propertyRef = doc(db, 'properties', id)
    const propertySnap = await getDoc(propertyRef)
    
    if (propertySnap.exists()) {
      const property = propertySnap.data()
      const title = property.title || 'Property'
      const description = property.description || property.details || `${title} in Ghana`
      const price = property.price ? `GH₵${property.price.toLocaleString()}` : ''
      const image = property.images?.[0] || property.image || '/placeholder.jpg'
      const location = property.location || 'Ghana'
      const type = property.type || 'For Sale'
      
      return {
        title: `${title} ${type} ${price ? `- ${price}` : ''} | Property in Ghana`,
        description: `${description.slice(0, 155)}... ${title} ${type} in ${location}. Find properties on Huhu Ghana.`,
        openGraph: {
          title: `${title} ${price ? `- ${price}` : ''}`,
          description: description.slice(0, 200),
          url: `https://www.shops-huhu.com/property/${id}`,
          type: 'website',
          images: [
            {
              url: image,
              width: 800,
              height: 600,
              alt: title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} ${price ? `- ${price}` : ''}`,
          description: description.slice(0, 200),
          images: [image],
        },
        alternates: {
          canonical: `https://www.shops-huhu.com/property/${id}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Property | Huhu Ghana',
    description: 'View property details on Huhu Ghana - Find properties across Ghana.',
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
