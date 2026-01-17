import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs in Ghana | Find Jobs & Post Job Listings',
  description: 'Find the best jobs in Ghana. Browse job listings across Accra, Kumasi, and all regions. Post job openings for free. Full-time, part-time, and remote opportunities.',
  keywords: ['jobs Ghana', 'jobs Accra', 'jobs Kumasi', 'employment Ghana', 'careers Ghana', 'job listings Ghana', 'hiring Ghana'],
  openGraph: {
    title: 'Jobs in Ghana | Huhu Ghana',
    description: 'Find the best jobs in Ghana. Browse job listings across all regions. Full-time, part-time, and remote opportunities.',
    url: 'https://www.shops-huhu.com/jobs',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.shops-huhu.com/jobs',
  },
}

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
