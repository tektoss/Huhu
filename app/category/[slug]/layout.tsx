import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

const categoryMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  vehicles: {
    title: 'Cars & Vehicles for Sale in Ghana',
    description: 'Buy and sell cars, motorcycles, trucks, and vehicles in Ghana. Find new and used vehicles in Accra, Kumasi, and all regions. Free listings on Huhu Ghana.',
    keywords: ['cars Ghana', 'vehicles Ghana', 'used cars Ghana', 'buy car Accra', 'sell car Ghana', 'motorcycles Ghana'],
  },
  electronics: {
    title: 'Electronics for Sale in Ghana',
    description: 'Buy and sell electronics in Ghana. Laptops, TVs, computers, gaming consoles, and more. New and used electronics across Accra, Kumasi, and all regions.',
    keywords: ['electronics Ghana', 'laptops Ghana', 'TVs Ghana', 'computers Ghana', 'gaming Ghana', 'buy electronics Accra'],
  },
  phones: {
    title: 'Phones & Tablets for Sale in Ghana',
    description: 'Buy and sell phones and tablets in Ghana. iPhones, Samsung, Tecno, and more. New and used mobile devices across Accra, Kumasi, and all regions.',
    keywords: ['phones Ghana', 'iPhones Ghana', 'Samsung Ghana', 'tablets Ghana', 'mobile phones Accra', 'used phones Ghana'],
  },
  fashion: {
    title: 'Fashion & Clothing for Sale in Ghana',
    description: 'Buy and sell fashion items in Ghana. Clothes, shoes, bags, jewelry, and accessories. New and pre-owned fashion across Accra, Kumasi, and all regions.',
    keywords: ['fashion Ghana', 'clothes Ghana', 'shoes Ghana', 'bags Ghana', 'jewelry Ghana', 'African fashion'],
  },
  furniture: {
    title: 'Furniture for Sale in Ghana',
    description: 'Buy and sell furniture in Ghana. Sofas, beds, tables, chairs, and home furniture. New and used furniture across Accra, Kumasi, and all regions.',
    keywords: ['furniture Ghana', 'sofas Ghana', 'beds Ghana', 'tables Ghana', 'home furniture Accra', 'office furniture Ghana'],
  },
  'health-beauty': {
    title: 'Health & Beauty Products in Ghana',
    description: 'Buy and sell health and beauty products in Ghana. Skincare, haircare, makeup, and wellness products across Accra, Kumasi, and all regions.',
    keywords: ['health Ghana', 'beauty Ghana', 'skincare Ghana', 'makeup Ghana', 'haircare Ghana', 'wellness Ghana'],
  },
  books: {
    title: 'Books for Sale in Ghana',
    description: 'Buy and sell books in Ghana. Textbooks, novels, educational materials, and more. New and used books across Accra, Kumasi, and all regions.',
    keywords: ['books Ghana', 'textbooks Ghana', 'novels Ghana', 'educational books Ghana', 'used books Accra'],
  },
  'home-garden': {
    title: 'Home & Garden Items in Ghana',
    description: 'Buy and sell home and garden items in Ghana. Appliances, decor, gardening tools, and more across Accra, Kumasi, and all regions.',
    keywords: ['home Ghana', 'garden Ghana', 'appliances Ghana', 'home decor Ghana', 'gardening Ghana'],
  },
  sports: {
    title: 'Sports & Fitness Equipment in Ghana',
    description: 'Buy and sell sports and fitness equipment in Ghana. Gym equipment, sportswear, and outdoor gear across Accra, Kumasi, and all regions.',
    keywords: ['sports Ghana', 'fitness Ghana', 'gym equipment Ghana', 'sportswear Ghana', 'outdoor gear Ghana'],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = categoryMetadata[slug] || {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')} for Sale in Ghana`,
    description: `Buy and sell ${slug.replace('-', ' ')} in Ghana. Find items across Accra, Kumasi, and all regions on Huhu Ghana.`,
    keywords: [`${slug} Ghana`, 'buy Ghana', 'sell Ghana'],
  }
  
  return {
    title: category.title,
    description: category.description,
    keywords: category.keywords,
    openGraph: {
      title: `${category.title} | Huhu Ghana`,
      description: category.description,
      url: `https://www.shops-huhu.com/category/${slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.shops-huhu.com/category/${slug}`,
    },
  }
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
