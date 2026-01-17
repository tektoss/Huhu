"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { showToast } from "@/utils/showToast"
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser"

export function useWishlist() {
  const { user } = useAuthUser();
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch wishlist items when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistItems([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const wishlistDocRef = doc(db, "wishlists", user.uid)
        const wishlistDoc = await getDoc(wishlistDocRef)

        if (wishlistDoc.exists() && wishlistDoc.data().itemIds) {
          setWishlistItems(wishlistDoc.data().itemIds)
        } else {
          // Initialize empty wishlist if it doesn't exist
          setWishlistItems([])
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  // Add product to wishlist
  const addToWishlist = async (productId: string) => {
    if (!user) return false

    try {
      const wishlistDocRef = doc(db, "wishlists", user.uid)
      await setDoc(
        wishlistDocRef,
        {
          itemIds: arrayUnion(productId),
        },
        { merge: true }
      )
      setWishlistItems((prev) => [...prev, productId])
      showToast("Product added to wishlist successfully", "success")
      return true
    } catch (error) {
      showToast("Error adding product to wishlist", "error")
      console.error("Error adding to wishlist:", error)
      return false
    }
  }

  // Remove product from wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!user) return false

    try {
      const wishlistDocRef = doc(db, "wishlists", user.uid)
      await setDoc(
        wishlistDocRef,
        {
          itemIds: arrayRemove(productId),
        },
        { merge: true }
      )
      setWishlistItems((prev) => prev.filter((id) => id !== productId))
      showToast("Product removed from wishlist successfully", "success")
      return true
    } catch (error) {
      showToast("Error removing product from wishlist", "error");
      console.error("Error removing from wishlist:", error)
      return false
    }
  }

  // Toggle product in wishlist
  const toggleWishlistItem = async (productId: string) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(productId)
    }
  }

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId)
  }

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    isInWishlist,
  }
}
