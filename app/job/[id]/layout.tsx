import type { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  try {
    const jobRef = doc(db, 'jobs', id)
    const jobSnap = await getDoc(jobRef)
    
    if (jobSnap.exists()) {
      const job = jobSnap.data()
      const title = job.title || 'Job Opening'
      const company = job.company || ''
      const description = job.description || `${title} at ${company}`
      const location = job.location || 'Ghana'
      const salary = job.salary ? `GH₵${job.salary}` : ''
      
      return {
        title: `${title} ${company ? `at ${company}` : ''} | Jobs in Ghana`,
        description: `${description.slice(0, 155)}... Apply for ${title} in ${location}. Find jobs on Huhu Ghana.`,
        openGraph: {
          title: `${title} ${company ? `at ${company}` : ''}`,
          description: description.slice(0, 200),
          url: `https://www.shops-huhu.com/job/${id}`,
          type: 'website',
        },
        alternates: {
          canonical: `https://www.shops-huhu.com/job/${id}`,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Job Opening | Huhu Ghana',
    description: 'View job details on Huhu Ghana - Find jobs across Ghana.',
  }
}

export default function JobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
