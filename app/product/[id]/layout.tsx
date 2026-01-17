import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  try {
    const productRef = doc(db, 'products', id)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      const product = productSnap.data()
      const title = product.title || product.name || 'Product'
      const description = product.details || product.description || `${title} for sale in Ghana`
      const price = product.price ? `GH₵${product.price.toLocaleString()}` : ''
      const image = product.images?.[0] || product.image || '/placeholder.jpg'
      const location = product.vendor?.location || 'Ghana'
      
      return {
        title: `${title} ${price ? `- ${price}` : ''} | Buy in Ghana`,
        description: `${description.slice(0, 155)}... Buy ${title} in ${location}. Safe transactions on Huhu Ghana.`,
        openGraph: {
          title: `${title} ${price ? `- ${price}` : ''}`,
          description: description.slice(0, 200),
          url: `https://www.shops-huhu.com/product/${id}`,
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
          canonical: `https://www.shops-huhu.com/product/${id}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Product | Huhu Ghana',
    description: 'View product details on Huhu Ghana - Ghana\'s largest online marketplace.',
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
