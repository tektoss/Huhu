"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import NavBar from "@/components/nav-bar"
import ProductCard from "@/components/product-card"
import { useWishlist } from "@/hooks/use-wishlist"
import { db } from "@/lib/firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import { PropertyListing } from "@/utils/dataFetch"
import type { FirebaseProduct } from "@/lib/firebase/firestore"

export default function WishlistPage() {
  const { wishlistItems, loading: wishlistLoading } = useWishlist()
  const [products, setProducts] = useState<FirebaseProduct[]>([])
  const [properties, setProperties] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState(true) // Show debug info

  // Group products by type
  const groupedProducts = products.reduce((acc, product) => {
    const type = product.itemType || 'others'
    if (!acc[type]) acc[type] = []
    acc[type].push(product)
    return acc
  }, {} as Record<string, FirebaseProduct[]>)

  const typeLabels: Record<string, string> = {
    'electronics': '📱 Electronics',
    'vehicles': '🚗 Vehicles',
    'apartments': '🏠 Apartments',
    'jobs': '💼 Jobs',
    'others': '📦 Other Items'
  }

  useEffect(() => {
    const fetchWishlistItems = async () => {
      console.log("Wishlist items:", wishlistItems)
      if (wishlistItems.length === 0) {
        setProducts([])
        setProperties([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch from both products and properties collections
        const itemPromises = wishlistItems.map(async (itemId) => {
          console.log("Fetching wishlist item:", itemId)
          
          // Try products first
          const productDocRef = doc(db, "products", itemId)
          const productDoc = await getDoc(productDocRef)
          
          if (productDoc.exists()) {
            console.log("Found product:", itemId)
            return { type: "product", data: { id: productDoc.id, ...productDoc.data() } as FirebaseProduct }
          }
          
          // Try properties
          const propertyDocRef = doc(db, "Roommate", itemId)
          const propertyDoc = await getDoc(propertyDocRef)
          
          if (propertyDoc.exists()) {
            console.log("Found property:", itemId)
            return { type: "property", data: { id: propertyDoc.id, ...propertyDoc.data() } as PropertyListing }
          }
          
          console.log("Item not found in either collection:", itemId)
          return null
        })

        const itemsData = await Promise.all(itemPromises)
        const filteredItems = itemsData.filter((item) => item !== null)
        
        console.log("Filtered items:", filteredItems)
        
        const productsData = filteredItems
          .filter((item) => item?.type === "product")
          .map((item) => item?.data as FirebaseProduct)
        
        const propertiesData = filteredItems
          .filter((item) => item?.type === "property")
          .map((item) => item?.data as PropertyListing)
        
        console.log("Products:", productsData)
        console.log("Properties:", propertiesData)
        
        setProducts(productsData)
        setProperties(propertiesData)
      } catch (error) {
        console.error("Error fetching wishlist items:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!wishlistLoading) {
      fetchWishlistItems()
    }
  }, [wishlistItems, wishlistLoading])

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>
{/* 
        {debug && (
          <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">Debug Info:</p>
            <p className="text-sm text-blue-800">Wishlist Items: {wishlistItems.length}</p>
            <p className="text-sm text-blue-800">Items: {wishlistItems.join(", ") || "None"}</p>
            <p className="text-sm text-blue-800">Loading: {wishlistLoading ? "true" : "false"}</p>
            <button
              onClick={() => setDebug(!debug)}
              className="mt-2 text-xs underline text-blue-600 hover:text-blue-800"
            >
              Hide Debug
            </button>
          </div>
        )} */}

        {loading || wishlistLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-square"></div>
                <div className="h-4 mt-3 bg-gray-200 rounded"></div>
                <div className="h-4 mt-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 || properties.length > 0 ? (
          <div className="space-y-8">
            {properties.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Properties</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {properties.map((property) => (
                    <Link key={property.id} href={`/property/${property.id}`}>
                      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
                        <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                          <img
                            src={property.images?.[0] || property.image || "/property_placeholder.png"}
                            alt={property.propertyTypes || "Property"}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/property_placeholder.png"
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm font-semibold">
                            ₵{property.rentPrice}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">{property.propertyTypes}</h3>
                          <p className="text-xs text-gray-600 truncate">{property.propertyAddie}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {products.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Products</h2>
                {Object.entries(groupedProducts).map(([type, items]) => (
                  <div key={type} className="mb-8">
                    <h3 className="mb-3 text-lg font-medium text-gray-700">{typeLabels[type] || type}</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
                      {items.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 mt-8 text-center bg-white rounded-lg shadow">
            <div className="p-3 mb-4 bg-gray-100 rounded-full">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Your wishlist is empty</h3>
            <p className="mb-4 text-gray-600">Save items you like by clicking the heart icon</p>
            <Link href="/" className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
