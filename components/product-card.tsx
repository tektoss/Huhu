"use client"

import type React from "react"
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import type { FirebaseProduct } from "@/lib/firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { showToast } from '@/utils/showToast';
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser";

export default function ProductCard({ product }: { product: FirebaseProduct}) {
  const { user } = useAuthUser();

  const { isInWishlist, toggleWishlistItem } = useWishlist()  
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Redirect to sign in or show sign in modal
      alert("Please sign in to add items to your wishlist")
      return
    }

    setIsLiking(true)
    await toggleWishlistItem(product.id)
    setIsLiking(false)
  }

  // Use the first image from the images array, or a placeholder if no images
  const productImage =
    product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg?height=400&width=400"

  const isLiked = isInWishlist(product.id)

  const locationObject = typeof product.location === "object" && product.location !== null ? (product.location as Record<string, any>) : null
  const locationRegion = locationObject?.region ?? locationObject?.state ?? locationObject?.province ?? null
  const locationSuburb = locationObject?.suburb ?? locationObject?.town ?? locationObject?.city ?? null
  const locationCountry = locationObject?.country ?? null
  const locationFallback = typeof product.location === "string" ? product.location : ""

  const formattedLocation = (() => {
    if (product.propertyLocation) {
      const segments = [product.propertyLocation, locationSuburb, locationRegion].filter(Boolean)
      if (segments.length) return segments.join(", ")
    }

    const parts = [locationRegion, locationSuburb].filter(Boolean)
    if (parts.length) {
      return parts.join(", ")
    }

    if (locationCountry) {
      return locationCountry
    }

    return locationFallback
  })()

  const displayCountry = locationCountry && formattedLocation && !formattedLocation.includes(locationCountry)
  
  // Determine the route based on product category or structure
  // Check if it's a property by looking for property-specific fields (propertyTypes, rentPrice, bedbath)
  const isProperty = product.category === "property" || product.category === "properties" || 
                     (product as any).propertyTypes || (product as any).rentPrice || (product as any).bedbath;
  const productRoute = isProperty 
    ? `/property/${product.id}` 
    : `/product/${product.id}`;
  
  return (
    <Link href={productRoute} className="group">
      <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-square">
        <Image
          src={productImage || "/user_placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Floating tag */}
        {product.tag && (
          <div className="absolute px-2 py-1 text-xs font-medium text-white bg-black top-2 left-2">{product.tag}</div>
        )}

        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute p-2 transition-colors bg-white rounded-full shadow-md top-2 right-2 hover:bg-gray-100 ${
            isLiking ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 font-medium">
          GH₵{Number((product as any).price || (product as any).rentPrice || 0).toFixed(2)}
        </p>
        {formattedLocation && <p className="mt-1 text-sm text-gray-500">{formattedLocation}</p>}
        {displayCountry && <p className="text-xs text-gray-400">{locationCountry}</p>}
      </div>
    </Link>
  )
}
