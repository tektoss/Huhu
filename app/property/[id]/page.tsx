"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Share2, Heart, Flag, ChevronLeft, ChevronRight, Badge, Eye, Trash2, Edit, CheckCircle } from "lucide-react"
import NavBar from "@/components/nav-bar"
import { fetchPropertyList, PropertyListing } from "@/utils/dataFetch"
import { showToast } from "@/utils/showToast"
import { getPostedTimeFromFirestore, calculateDistance } from "@/utils/getters"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser"
import { doc, updateDoc, deleteDoc, increment, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthUser()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const propertyId = params.id as string

  const [property, setProperty] = useState<PropertyListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [similarProperties, setSimilarProperties] = useState<PropertyListing[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [status, setStatus] = useState<string>("available")

  const images = property?.images || (property?.image ? [property.image] : [])

  const fetchData = async () => {
    try {
      const properties = await fetchPropertyList()
      const found = properties.find((p) => p.id === propertyId)
      if (found) {
        setProperty(found)
        setIsSaved(isInWishlist(propertyId))
        setViewCount(found.viewCount?.length || 0)
        setStatus(found.status || "available")
        setIsOwner(found.vendor?.email === user?.email)
        
        // Get similar properties (same type, different ID)
        const similar = properties
          .filter((p) => p.propertyTypes === found.propertyTypes && p.id !== propertyId)
          .slice(0, 4)
        setSimilarProperties(similar)
        
        // Track view count
        if (user && found.vendor?.email !== user?.email) {
          trackPropertyView(propertyId, user.email || "")
        }
      } else {
        showToast("Property not found.", "error")
        router.push("/properties")
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      showToast("Error fetching property details.", "error")
      console.error("Error:", err)
    }
  }

  const trackPropertyView = async (propId: string, userEmail: string) => {
    try {
      const propRef = doc(db, "Roommate", propId)
      await updateDoc(propRef, {
        viewCount: increment(1)
      })
    } catch (err) {
      console.error("Error tracking view:", err)
    }
  }

  const handleDeleteProperty = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return
    
    try {
      await deleteDoc(doc(db, "Roommate", propertyId))
      showToast("Property deleted successfully", "success")
      router.push("/properties")
    } catch (err) {
      showToast("Error deleting property", "error")
      console.error("Error:", err)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateDoc(doc(db, "Roommate", propertyId), {
        status: newStatus
      })
      setStatus(newStatus)
      showToast(`Property marked as ${newStatus}`, "success")
    } catch (err) {
      showToast("Error updating status", "error")
      console.error("Error:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [propertyId])

  const handleSaveProperty = async () => {
    if (!user) {
      showToast("Please sign in to save properties", "info")
      return
    }

    if (isSaved) {
      await removeFromWishlist(propertyId)
      setIsSaved(false)
      showToast("Removed from wishlist", "success")
    } else {
      await addToWishlist(propertyId)
      setIsSaved(true)
      showToast("Added to wishlist", "success")
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/property/${propertyId}`
    navigator.clipboard.writeText(url)
    showToast("Property link copied to clipboard!", "success")
    setShowShareModal(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-gray-600">Property not found</p>
            <Link href="/properties" className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
              Back to Properties
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      {/* Image Gallery */}
      <div className="relative bg-black h-screen md:h-screen mx-auto max-w-md w-full">
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex] || "/property_placeholder.png"}
              alt={`Property image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/property_placeholder.png"
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/50 px-3 py-1 rounded-full">
                  <span className="text-white text-sm">{currentImageIndex + 1}</span>
                  <span className="text-white text-sm">/</span>
                  <span className="text-white text-sm">{images.length}</span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No images available</span>
          </div>
        )}

        {/* Price Badge */}
        {property.rentPrice && (
          <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-lg font-bold text-lg">
            ₵{property.rentPrice}
          </div>
        )}
      </div>

      <div className="container flex-1 px-4 py-6 mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="mb-2 text-3xl font-bold">{property.propertyTypes || "Property"}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {property.propertyAddie}, {property.location?.town}, {property.location?.state}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Posted {getPostedTimeFromFirestore(property.createdAt || property.datePosted)}
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg md:grid-cols-3">
              {property.bedbath && (
                <div>
                  <div className="text-sm text-gray-600">Beds & Baths</div>
                  <div className="text-lg font-semibold">{property.bedbath}</div>
                </div>
              )}
              {property.leaseDuration && (
                <div>
                  <div className="text-sm text-gray-600">Lease Duration</div>
                  <div className="text-lg font-semibold">{property.leaseDuration}</div>
                </div>
              )}
              {property.rentPrice && (
                <div>
                  <div className="text-sm text-gray-600">Rent Price</div>
                  <div className="text-lg font-semibold">₵{property.rentPrice}</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.details && (
              <div>
                <h2 className="mb-3 text-xl font-bold">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.details}</p>
              </div>
            )}

            {/* Amenities */}
            {property.propertyAmenities && property.propertyAmenities.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-bold">Amenities</h2>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {property.propertyAmenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-100 rounded">
                      <Badge className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyles */}
            {property.lifestyles && property.lifestyles.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-bold">Lifestyles</h2>
                <div className="flex flex-wrap gap-2">
                  {property.lifestyles.map((lifestyle, index) => (
                    <span key={index} className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full">
                      {lifestyle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {property.location && (
              <div>
                <h2 className="mb-3 text-xl font-bold">Location</h2>
                <div className="p-4 bg-white rounded-lg">
                  <p className="mb-2">
                    <strong>Town:</strong> {property.location.town}
                  </p>
                  <p className="mb-2">
                    <strong>State/Region:</strong> {property.location.state}
                  </p>
                  {property.location.latitude && property.location.longitude && (
                    <p className="text-sm text-gray-600">
                      Coordinates: {property.location.latitude}, {property.location.longitude}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Vendor Info */}
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="mb-4 font-bold">Contact Vendor</h3>

              {property.vendor && (
                <div className="mb-4">
                  <p className="font-semibold">{property.vendor.firstName} {property.vendor.lastName}</p>
                  <p className="text-sm text-gray-600">{property.vendor.businessName}</p>
                </div>
              )}

              {property.phoneNumber && (
                <a
                  href={`tel:${property.phoneNumber}`}
                  className="flex items-center justify-center w-full mb-3 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              )}

              {property.email && (
                <a
                  href={`mailto:${property.email}`}
                  className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              )}
            </div>

            {/* Actions */}
            <button
              onClick={handleSaveProperty}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
                isSaved ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save Property"}
            </button>

            <button
              onClick={() => setShowShareModal(!showShareModal)}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>

            {showShareModal && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <button
                  onClick={handleShare}
                  className="w-full px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Copy Link
                </button>
              </div>
            )}

            <button
              onClick={() => setShowReportModal(!showReportModal)}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
            >
              <Flag className="w-5 h-5 mr-2" />
              Report
            </button>

            {showReportModal && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Report this property for:</p>
                <button className="w-full px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">
                  Report Issue
                </button>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="border-t pt-4 mt-4 space-y-2">
                <h3 className="font-semibold text-gray-800 mb-3">Owner Options</h3>
                
                <button
                  onClick={() => router.push(`/new-post/property?propertyId=${propertyId}`)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Property
                </button>

                {status !== "filled" ? (
                  <button
                    onClick={() => handleStatusChange("filled")}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Filled
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange("available")}
                    className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Available
                  </button>
                )}

                <button
                  onClick={handleDeleteProperty}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Property
                </button>
              </div>
            )}

            {/* View Count */}
            <div className="border-t pt-4 mt-4 flex items-center justify-center text-gray-600">
              <Eye className="w-4 h-4 mr-2" />
              <span className="text-sm">{viewCount} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container px-4 mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similarProperties.map((prop) => {
                const distance = property?.location && prop.location
                  ? calculateDistance(property.location, prop.location)
                  : null;
                return (
                  <Link key={prop.id} href={`/property/${prop.id}`}>
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full">
                      <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                        <Image
                          src={prop.images?.[0] || prop.image || "/property_placeholder.png"}
                          alt={prop.propertyTypes || "Property"}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/property_placeholder.png"
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm font-semibold">
                          ₵{prop.rentPrice}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{prop.propertyTypes}</h3>
                        <p className="text-xs text-gray-600 truncate">{prop.propertyAddie}</p>
                        {distance !== null && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">📍 {distance} km away</p>
                        )}
                        {prop.lifestyles && prop.lifestyles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prop.lifestyles.slice(0, 1).map((ls, idx) => (
                              <span key={idx} className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                                {ls}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
