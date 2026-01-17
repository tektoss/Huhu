"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Flag,
  Heart,
  Share,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Wrench,
  Building,
  Globe,
} from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import NavBar from "@/components/nav-bar"
import { useAppDispatch } from "@/lib/redux/hooks"
import { openShareModal, openReportModal } from "@/lib/redux/slices/uiSlice"
import ProductNotFound from "@/components/product-not-found"
import { useWishlist } from "@/hooks/use-wishlist"
import { useParams, useRouter } from "next/navigation"
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser"
import { ConsultantListing } from "@/utils/dataFetch"
import { getPostedTimeFromFirestore } from "@/utils/getters"
import LoadingSpinner from "@/components/loading-spinner"

export default function ServicePage() {
  const { id }: { id: string } = useParams()
  const [service, setService] = useState<ConsultantListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const { user } = useAuthUser()
  const { isInWishlist, toggleWishlistItem } = useWishlist()
  const [isLiking, setIsLiking] = useState(false)
  const router = useRouter()

  // Check if current user is the owner
  const isOwner = user?.uid === service?.vendor?.uid

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true)
        setError(null)

        const serviceDocRef = doc(db, "Consultants", id)
        const serviceDocSnap = await getDoc(serviceDocRef)

        if (!serviceDocSnap.exists()) {
          setError("Service not found")
          setLoading(false)
          return
        }

        const serviceData = {
          id: serviceDocSnap.id,
          ...serviceDocSnap.data(),
        } as ConsultantListing

        setService(serviceData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching service:", error)
        setError("Failed to load service")
        setLoading(false)
      }
    }

    fetchServiceData()
  }, [id])

  // Get normalized service data
  const getServiceData = (s: ConsultantListing) => ({
    title: s.title || s.vendor?.Company || "Service Provider",
    description: s.description || s.details || "No description provided.",
    serviceTypes: s.serviceTypes || (s.serviceType ? s.serviceType.split(", ").filter(Boolean) : []),
    expertise: s.expertise || (s.Expertise ? s.Expertise.split(", ").filter(Boolean) : []),
    location: s.location?.region 
      ? `${s.location.suburb || ""}, ${s.location.region}`.replace(/^, /, "")
      : s.location?.town && s.location?.state 
        ? `${s.location.town}, ${s.location.state}` 
        : s.location?.state || s.location?.town || "",
    phone: s.phone || s.PhoneNumber || "",
    email: s.email || s.consultantEmail || "",
    image: s.image || s.vendor?.photoUrl || "/user_placeholder.png",
    company: s.company || s.vendor?.Company || "",
    address: s.vendor?.addresss || "",
    postedTime: getPostedTimeFromFirestore(s.createdAt || s.datePosted),
  })

  const handleLike = async () => {
    if (!service) return
    setIsLiking(true)
    try {
      await toggleWishlistItem({
        id: service.id,
        name: getServiceData(service).title,
        price: 0,
        description: getServiceData(service).description,
        images: service.image ? [service.image] : [],
        category: "Services",
        location: service.location || { region: "", suburb: "" },
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = () => {
    if (service) {
      const serviceUrl = `${window.location.origin}/service/${service.id}`
      dispatch(openShareModal({ productId: service.id, productUrl: serviceUrl }))
    }
  }

  const handleReport = () => {
    if (service) {
      dispatch(openReportModal(service.id))
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </main>
    )
  }

  if (error || !service) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <div className="container px-4 py-8 mx-auto">
          <ProductNotFound message={error || "The service you're looking for doesn't exist or has been removed."} />
        </div>
      </main>
    )
  }

  const data = getServiceData(service)
  const isLiked = isInWishlist(service.id)

  return (
    <main className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="container px-4 py-8 mx-auto">
        <Link href="/services" className="inline-flex items-center mb-6 text-gray-600 hover:text-black">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-slate-200 border border-slate-400 overflow-hidden flex-shrink-0">
                  <Image
                    src={data.image}
                    alt={data.title}
                    width={80}
                    height={80}
                    className="object-cover w-20 h-20 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>
                  {data.company && (
                    <p className="flex items-center text-gray-600 mb-1">
                      <Building className="w-4 h-4 mr-2" />
                      {data.company}
                    </p>
                  )}
                  {data.location && (
                    <p className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {data.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                    isLiked 
                      ? "bg-red-50 border-red-300 text-red-600" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-red-500" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </button>
                {!isOwner && (
                  <button
                    onClick={handleReport}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-red-600"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-500 mt-4">
                Posted {data.postedTime}
              </div>
            </div>

            {/* Service Types */}
            {data.serviceTypes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {data.serviceTypes.map((type, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {type.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expertise/Skills */}
            {data.expertise.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Expertise & Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{data.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {data.phone && (
                  <a
                    href={`tel:${data.phone}`}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    {data.phone}
                  </a>
                )}
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    {data.email}
                  </a>
                )}
                {data.address && (
                  <p className="flex items-start text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                    {data.address}
                  </p>
                )}
              </div>

              {/* Contact Buttons */}
              {(data.phone || data.email) && (
                <div className="mt-6 space-y-2">
                  {data.phone && (
                    <a
                      href={`tel:${data.phone}`}
                      className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  )}
                  {data.email && (
                    <a
                      href={`mailto:${data.email}?subject=Inquiry about your services`}
                      className="w-full flex items-center justify-center px-4 py-3 border border-primary text-primary rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Location Map Placeholder */}
            {data.location && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  {data.location}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
