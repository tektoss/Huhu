"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Banknote, MapPin, Phone, Mail, Search, Wrench } from "lucide-react"
import Image from "next/image"
import NavBar from "@/components/nav-bar"
import { useRouter } from 'next/navigation'
import { fetchConsultantList, ConsultantListing } from "@/utils/dataFetch"
import { showToast } from "@/utils/showToast"
import { getPostedTimeFromFirestore } from "@/utils/getters"

export default function ServicesListingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allServices, setAllServices] = useState<ConsultantListing[]>([])
  const [filteredServices, setFilteredServices] = useState<ConsultantListing[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchData = async () => {
    try {
      setLoading(true)
      const services = await fetchConsultantList()
      setAllServices(services)
      setFilteredServices(services)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      showToast("Unable to fetch services. Please try again later.", "error")
      console.error("Error fetching services:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    const search = searchTerm.toLowerCase()
    const filtered = allServices.filter((service) =>
      (service.title || service.vendor?.Company || "").toLowerCase().includes(search) ||
      (service.category || service.serviceType || "").toLowerCase().includes(search) ||
      (service.description || service.details || "").toLowerCase().includes(search) ||
      (service.Expertise || "").toLowerCase().includes(search) ||
      (service.expertise?.join(" ") || "").toLowerCase().includes(search)
    )
    setFilteredServices(filtered)
  }

  // Helper to get service display data
  const getServiceData = (service: ConsultantListing) => {
    return {
      title: service.title || service.vendor?.Company || "Service Provider",
      description: service.description || service.details || "",
      serviceTypes: service.serviceTypes || (service.serviceType ? service.serviceType.split(", ").filter(Boolean) : []),
      expertise: service.expertise || (service.Expertise ? service.Expertise.split(", ").filter(Boolean) : []),
      location: service.location?.region || service.location?.state || service.location?.town || "",
      phone: service.phone || service.PhoneNumber || "",
      email: service.email || service.consultantEmail || "",
      image: service.image || service.vendor?.photoUrl || "/user_placeholder.png",
      postedTime: getPostedTimeFromFirestore(service.createdAt || service.datePosted),
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
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Services</h1>
          <p className="text-lg text-gray-600">Find skilled professionals and service providers near you.</p>
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
                placeholder="Search for services, skills, or providers..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button 
                onClick={handleSearch} 
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border-l border-gray-300 rounded-r-md hover:bg-gray-200"
                aria-label="Search services"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
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
                {filteredServices?.length} {filteredServices?.length === 1 ? "Service" : "Services"}
              </h2>
              <Link
                href="/new-post/services"
                className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-light"
              >
                Post a Service
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredServices?.length !== 0 ? (
                filteredServices.map((service: ConsultantListing) => {
                  const data = getServiceData(service)
                  return (
                    <button
                      key={service.id}
                      onClick={() => router.push(`/service/${service.id}`)}
                      className="hover:bg-slate-100 border border-slate-400 rounded-lg p-4 flex flex-col w-full gap-y-3 overflow-hidden text-left"
                    >
                      {/* Header with image and title */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-300 border border-slate-500 overflow-hidden">
                          <Image
                            src={data.image}
                            alt={data.title}
                            width={48}
                            height={48}
                            className="object-cover w-12 h-12 rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-700 truncate">{data.title}</h3>
                          <p className="text-xs text-slate-500">{data.postedTime}</p>
                        </div>
                      </div>

                      {/* Service Types */}
                      {data.serviceTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1 overflow-hidden max-h-[50px]">
                          {data.serviceTypes.slice(0, 3).map((type, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs truncate max-w-[120px]"
                            >
                              {type.trim()}
                            </span>
                          ))}
                          {data.serviceTypes.length > 3 && (
                            <span className="px-2 py-1 bg-slate-200 text-slate-500 rounded text-xs">
                              +{data.serviceTypes.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Expertise/Skills */}
                      {data.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1 overflow-hidden max-h-[50px]">
                          {data.expertise.slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs truncate max-w-[100px]"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                          {data.expertise.length > 4 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded text-xs">
                              +{data.expertise.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Location */}
                      {data.location && (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{data.location}</span>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="flex items-center gap-4 text-slate-500 text-sm">
                        {data.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span className="truncate">{data.phone}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })
              ) : (
                <p className="col-span-full text-center text-gray-500 py-8">No services found.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-bold">Huhu</h3>
              <p className="text-gray-400">Find and offer services in Ghana.</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">Home</Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-white">Jobs</Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white">Services</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
            &copy; {new Date().getFullYear()} Huhu. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
