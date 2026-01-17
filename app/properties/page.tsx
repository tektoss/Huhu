"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Search, Home } from "lucide-react"
import Image from "next/image"
import NavBar from "@/components/nav-bar"
import { useRouter } from 'next/navigation'
import { fetchPropertyList, PropertyListing } from "@/utils/dataFetch"
import { showToast } from "@/utils/showToast"
import { getPostedTimeFromFirestore } from "@/utils/getters"

export default function PropertiesListingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allProperties, setAllProperties] = useState<PropertyListing[]>([])
  const [filteredProperties, setFilteredProperties] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchData = async () => {
    try {
      setLoading(true)
      const properties = await fetchPropertyList()
      setAllProperties(properties)
      setFilteredProperties(properties)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      showToast("Unable to fetch properties. Please try again later.", "error")
      console.error("Error fetching properties:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    const search = searchTerm.toLowerCase()
    const filtered = allProperties.filter((property) =>
      (property.propertyTypes || "").toLowerCase().includes(search) ||
      (property.propertyAddie || "").toLowerCase().includes(search) ||
      (property.bedbath || "").toLowerCase().includes(search) ||
      (property.details || "").toLowerCase().includes(search) ||
      (property.location?.town || "").toLowerCase().includes(search) ||
      (property.location?.state || "").toLowerCase().includes(search)
    )
    setFilteredProperties(filtered)
  }

  // Helper to get property display data
  const getPropertyData = (property: PropertyListing) => {
    return {
      title: property.propertyTypes || "Property",
      address: property.propertyAddie || "",
      bedbath: property.bedbath || "",
      rentPrice: property.rentPrice ? `₵${property.rentPrice}` : "POA",
      description: property.details || "",
      location: `${property.location?.town || ""}, ${property.location?.state || ""}`.trim(),
      phone: property.phoneNumber || property.phone || "",
      email: property.email || "",
      image: property.images?.[0] || property.image || "/property_placeholder.png",
      postedTime: getPostedTimeFromFirestore(property.createdAt || property.datePosted),
      vendor: property.vendor?.firstName || "Property Owner",
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section 
        className="bg-cover bg-center relative h-[250px] bg-gray-100"
        style={{ backgroundImage: "url('/pattern_bg.jpg')" }}
      >
        <div className="container flex flex-col items-center justify-center h-full px-4 mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Properties & Apartments</h1>
          <p className="text-lg text-gray-600">Find your perfect place to live.</p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-6 bg-white border-b">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by location, type, or features..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button 
                onClick={handleSearch} 
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border-l border-gray-300 rounded-r-md hover:bg-gray-200"
                aria-label="Search properties"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <Link
              href="/new-post/property"
              className="px-4 py-3 text-white bg-black rounded-md hover:bg-gray-800 whitespace-nowrap"
            >
              Post Property
            </Link>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      {loading ? (
        <section className="py-8 bg-gray-50 flex-1">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48"></div>
                  <div className="h-4 mt-3 bg-gray-200 rounded"></div>
                  <div className="h-4 mt-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-8 bg-gray-50 flex-1">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {filteredProperties?.length} {filteredProperties?.length === 1 ? "Property" : "Properties"}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredProperties?.length !== 0 ? (
                filteredProperties.map((property: PropertyListing) => {
                  const data = getPropertyData(property)
                  return (
                    <Link key={property.id} href={`/property/${property.id}`}>
                      <div className="h-full bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer max-w-xs">
                        {/* Image */}
                        <div className="relative w-full h-56 bg-gray-200 overflow-hidden">
                          <Image
                            src={data.image}
                            alt={data.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/property_placeholder.png"
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded text-sm font-semibold">
                            {data.rentPrice}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Type & Bed/Bath */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">{data.title}</span>
                            {data.bedbath && <span className="text-xs text-gray-600">{data.bedbath}</span>}
                          </div>

                          {/* Address */}
                          <h3 className="mb-2 text-lg font-semibold text-gray-800 truncate">{data.address}</h3>

                          {/* Location */}
                          <div className="flex items-center mb-3 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{data.location}</span>
                          </div>

                          {/* Description snippet */}
                          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{data.description}</p>

                          {/* Amenities */}
                          {property.propertyAmenities && property.propertyAmenities.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1">
                              {property.propertyAmenities.slice(0, 3).map((amenity, idx) => (
                                <span key={idx} className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                                  {amenity}
                                </span>
                              ))}
                              {property.propertyAmenities.length > 3 && (
                                <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                                  +{property.propertyAmenities.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Lifestyles */}
                          {property.lifestyles && property.lifestyles.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1">
                              {property.lifestyles.slice(0, 2).map((lifestyle, idx) => (
                                <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                  {lifestyle}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Contact info */}
                          <div className="space-y-2 mb-3 text-xs text-gray-700">
                            {data.phone && (
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                                <span>{data.phone}</span>
                              </div>
                            )}
                            {data.email && (
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                                <span>{data.email}</span>
                              </div>
                            )}
                          </div>

                          {/* Vendor & Time */}
                          <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
                            <span>{data.vendor}</span>
                            <span>{data.postedTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow">
                  <div className="p-3 mb-4 bg-gray-100 rounded-full">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No properties found</h3>
                  <p className="mb-4 text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
