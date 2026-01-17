import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  try {
    const vendorRef = doc(db, 'vendors', id)
    const vendorSnap = await getDoc(vendorRef)
    
    if (vendorSnap.exists()) {
      const vendor = vendorSnap.data()
      const name = vendor.displayName || vendor.name || 'Seller'
      const bio = vendor.bio || `View ${name}'s profile and listings on Huhu Ghana`
      const image = vendor.photoURL || vendor.profileImage || '/user_placeholder.png'
      const location = vendor.location?.region || 'Ghana'
      
      return {
        title: `${name} | Seller Profile in ${location}`,
        description: `${bio.slice(0, 155)}... View ${name}'s listings and contact them on Huhu Ghana.`,
        openGraph: {
          title: `${name} - Seller on Huhu Ghana`,
          description: bio.slice(0, 200),
          url: `https://www.shops-huhu.com/profile/${id}`,
          type: 'profile',
          images: [
            {
              url: image,
              width: 400,
              height: 400,
              alt: name,
            },
          ],
        },
        alternates: {
          canonical: `https://www.shops-huhu.com/profile/${id}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Seller Profile | Huhu Ghana',
    description: 'View seller profile on Huhu Ghana - Ghana\'s largest online marketplace.',
  }
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
