"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X, Check, AlertCircle } from "lucide-react"
import NavBar from "@/components/nav-bar"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import ProtectedRoute from "@/lib/auth/ProtectedRoutes"
import { db, storage } from "@/lib/firebase/firebase"
import { ghanaRegions } from "@/lib/ghana-regions"
import { showToast } from "@/utils/showToast"
import { useRouter } from "next/navigation"
import { getFirstThreeLetters } from "@/utils/getters"
import { nanoid } from "nanoid"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser"

// Form data type
interface ServiceForm {
  title: string
  company: string
  category: string
  otherCategory: string
  region: string
  suburb: string
  description: string
  email: string
  phone: string
  address: string
  vendor: {
    image?: string
    name?: string
    uid?: string
  }
}

interface ImageType {
  file: File
  preview: string
}

// Service categories
const SERVICE_CATEGORIES = [
  "Plumbing",
  "Electronics Repairs",
  "Home Repair Services",
  "HVAC (Heating, Ventilation, and Air Conditioning)",
  "Electrical Services",
  "Carpentry",
  "Cleaning Services",
  "Painting",
  "Landscaping & Gardening",
  "Moving & Delivery",
  "Auto Repair",
  "Beauty & Wellness",
  "Tutoring & Education",
  "IT & Tech Support",
  "Photography & Videography",
  "Event Planning",
  "Catering",
  "Legal Services",
  "Accounting & Finance",
  "Health & Fitness",
  "Pet Services",
  "Other",
]

// Expertise/Skills by category
const EXPERTISE_BY_CATEGORY: Record<string, string[]> = {
  "Plumbing": [
    "Toilet Repair/Installation",
    "Water Filtration System",
    "Pipe Repair",
    "Drain Cleaning",
    "Water Heater Installation",
    "Leak Detection",
    "Bathroom Remodeling",
  ],
  "Electronics Repairs": [
    "Computer Repair",
    "Phone Repair",
    "TV Repair",
    "Appliance Repair",
    "Laptop Repair",
    "Game Console Repair",
    "Printer Repair",
  ],
  "Home Repair Services": [
    "General Handyman",
    "Door/Window Repair",
    "Flooring Installation",
    "Drywall Repair",
    "Roof Repair",
    "Fence Installation",
    "Deck Building",
  ],
  "HVAC (Heating, Ventilation, and Air Conditioning)": [
    "AC Installation",
    "AC Repair",
    "Heating System Repair",
    "Duct Cleaning",
    "Thermostat Installation",
    "Ventilation Services",
  ],
  "Electrical Services": [
    "Wiring Installation",
    "Outlet Installation",
    "Lighting Installation",
    "Electrical Panel Upgrade",
    "Generator Installation",
    "Security System Installation",
  ],
  "Carpentry": [
    "Furniture Making",
    "Cabinet Installation",
    "Wood Flooring",
    "Custom Shelving",
    "Door Installation",
    "Trim Work",
  ],
  "Cleaning Services": [
    "Residential Cleaning",
    "Commercial Cleaning",
    "Deep Cleaning",
    "Carpet Cleaning",
    "Window Cleaning",
    "Move-in/Move-out Cleaning",
  ],
  "Auto Repair": [
    "Engine Repair",
    "Brake Service",
    "Oil Change",
    "Transmission Repair",
    "Tire Services",
    "Auto Electrical",
    "Body Work",
  ],
  "IT & Tech Support": [
    "Computer Setup",
    "Network Installation",
    "Software Installation",
    "Virus Removal",
    "Data Recovery",
    "Website Development",
  ],
  "default": [
    "Consultation",
    "Installation",
    "Repair",
    "Maintenance",
    "Emergency Service",
    "Custom Projects",
  ],
}

// Maximum file size (1MB)
const MAX_FILE_SIZE = 1024 * 1024

const initialFormState: ServiceForm = {
  title: "",
  company: "",
  category: "",
  otherCategory: "",
  region: "",
  suburb: "",
  description: "",
  email: "",
  phone: "",
  address: "",
  vendor: {},
}

export default function NewServicePage() {
  const { user } = useAuthUser()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ServiceForm>(initialFormState)
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])
  const [customExpertise, setCustomExpertise] = useState("")
  const [image, setImage] = useState<ImageType | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Get expertise based on selected category
  const getExpertiseForCategory = () => {
    if (!formData.category) return EXPERTISE_BY_CATEGORY.default
    return EXPERTISE_BY_CATEGORY[formData.category] || EXPERTISE_BY_CATEGORY.default
  }

  // Get suburbs for the selected region
  const getSuburbs = () => {
    if (!formData.region) return []
    return ghanaRegions[formData.region] || []
  }

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "region") {
      setFormData((prev) => ({
        ...prev,
        region: value,
        suburb: "",
      }))
    } else if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
      }))
      // Reset expertise when category changes
      setSelectedExpertise([])
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle expertise selection
  const handleExpertiseToggle = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise) ? prev.filter((e) => e !== expertise) : [...prev, expertise]
    )
  }

  // Handle service type (category) multi-select
  const handleServiceTypeToggle = (type: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  // Add custom expertise
  const handleAddCustomExpertise = () => {
    if (customExpertise.trim() && !selectedExpertise.includes(customExpertise.trim())) {
      setSelectedExpertise((prev) => [...prev, customExpertise.trim()])
      setCustomExpertise("")
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Image must be 1MB or less" }))
      return
    }

    if (errors.image) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })
    }

    if (image) {
      URL.revokeObjectURL(image.preview)
    }

    setImage({
      file,
      preview: URL.createObjectURL(file),
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Remove the uploaded image
  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.preview)
      setImage(null)
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Service/Business name is required"
    }

    if (selectedServiceTypes.length === 0) {
      newErrors.serviceTypes = "At least one service type is required"
    }

    if (!formData.region) {
      newErrors.region = "Region is required"
    }

    if (formData.region && !formData.suburb) {
      newErrors.suburb = "Suburb is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Service description is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (selectedExpertise.length === 0) {
      newErrors.expertise = "At least one expertise/skill is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (validateForm()) {
        const three = getFirstThreeLetters("services")
        const serviceId = `sg-${three}-${nanoid()}`

        const uploadSingleImage = async (img: ImageType | null, id: string) => {
          if (!img) return null

          const imageRef = ref(storage, `serviceImages/${id}/${img.file.name}`)
          const snapshot = await uploadBytes(imageRef, img.file)
          const downloadURL = await getDownloadURL(snapshot.ref)

          return {
            downloadURL,
            imageData: {
              url: downloadURL,
              path: snapshot.ref.fullPath,
              name: img.file.name,
              size: img.file.size,
              type: img.file.type,
            },
          }
        }

        const uploadedImage = await uploadSingleImage(image, serviceId)

        // Prepare the data object (matching legacy format for compatibility)
        const serviceData: Record<string, any> = {
          id: serviceId,
          // New web format
          title: formData.title,
          company: formData.company || formData.title,
          category: formData.category || selectedServiceTypes[0] || "Services",
          serviceTypes: selectedServiceTypes,
          expertise: selectedExpertise,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          location: { suburb: formData.suburb, region: formData.region },
          createdAt: serverTimestamp(),
          vendor: {
            uid: user?.uid || "",
            image: user?.photoURL || "",
            name: user?.displayName || "",
            Company: formData.company || formData.title,
            addresss: formData.address,
            photoUrl: user?.photoURL || "",
          },
          // Legacy format fields for mobile app compatibility
          consultType: "PersonnelConsultant",
          serviceType: selectedServiceTypes.join(", "),
          Expertise: selectedExpertise.join(", "),
          details: formData.description,
          consultantEmail: formData.email,
          PhoneNumber: formData.phone,
          datePosted: serverTimestamp(),
          lastEdited: serverTimestamp(),
          status: "active",
          postedFrom: "Web",
          viewCount: [],
        }

        // Only add image if uploaded
        if (uploadedImage) {
          serviceData.image = uploadedImage.downloadURL
          serviceData.imageData = uploadedImage.imageData
        }

        console.log("Service posting submitted:", serviceData)

        await setDoc(doc(db, "Consultants", serviceId), serviceData)

        showToast("Service posted successfully!", "success")
        setLoading(false)
        setFormData(initialFormState)
        setSelectedExpertise([])
        setSelectedServiceTypes([])
        setImage(null)
        router.push("/services")
      }
    } catch (error) {
      console.error("Error posting service:", error)
      showToast("Failed to post service. Please try again.", "error")
    }
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <NavBar />

        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/services" className="inline-flex items-center mb-4 text-gray-600 hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to services
              </Link>
              <h1 className="text-3xl font-bold">Post a Service</h1>
              <p className="mt-2 text-gray-600">
                Offer your professional services to people in your area.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business/Service Name */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                      Service/Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., John's Plumbing Services"
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-700">
                      Company Name (optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g., ABC Services Ltd"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Service Types */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Service Types <span className="text-red-500">*</span></h2>
                <p className="mb-4 text-sm text-gray-600">Select all service categories that apply</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {SERVICE_CATEGORIES.filter(c => c !== "Other").map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleServiceTypeToggle(type)}
                      className={`px-3 py-2 text-sm rounded-full transition-colors ${
                        selectedServiceTypes.includes(type)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {selectedServiceTypes.includes(type) && <Check className="inline w-4 h-4 mr-1" />}
                      {type}
                    </button>
                  ))}
                </div>
                {errors.serviceTypes && <p className="mt-1 text-sm text-red-500">{errors.serviceTypes}</p>}
              </div>

              {/* Expertise/Skills */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Expertise & Skills <span className="text-red-500">*</span></h2>
                <p className="mb-4 text-sm text-gray-600">Select your specific skills and expertise</p>

                {/* Dynamic skills based on first selected service type */}
                {selectedServiceTypes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Suggested skills for {selectedServiceTypes[0]}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(EXPERTISE_BY_CATEGORY[selectedServiceTypes[0]] || EXPERTISE_BY_CATEGORY.default).map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleExpertiseToggle(skill)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            selectedExpertise.includes(skill)
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {selectedExpertise.includes(skill) && <Check className="inline w-3 h-3 mr-1" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected expertise display */}
                {selectedExpertise.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpertise.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleExpertiseToggle(skill)}
                            className="ml-2 hover:text-green-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add custom expertise */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customExpertise}
                    onChange={(e) => setCustomExpertise(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomExpertise())}
                    placeholder="Add custom skill..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomExpertise}
                    className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
                {errors.expertise && <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>}
              </div>

              {/* Location */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Location</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-700">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.region ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Region</option>
                      {Object.keys(ghanaRegions).map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region}</p>}
                  </div>

                  <div>
                    <label htmlFor="suburb" className="block mb-2 text-sm font-medium text-gray-700">
                      Suburb <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="suburb"
                      name="suburb"
                      value={formData.suburb}
                      onChange={handleChange}
                      disabled={!formData.region}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.suburb ? "border-red-500" : "border-gray-300"
                      } ${!formData.region ? "bg-gray-100" : ""}`}
                    >
                      <option value="">Select Suburb</option>
                      {getSuburbs().map((suburb) => (
                        <option key={suburb} value={suburb}>
                          {suburb}
                        </option>
                      ))}
                    </select>
                    {errors.suburb && <p className="mt-1 text-sm text-red-500">{errors.suburb}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
                    Address (optional)
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., 123 Main Street, Osu"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Description</h2>

                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                    Service Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your services, experience, and what makes you stand out..."
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., 0244123456"
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Profile Image (Optional)</h2>
                <p className="mb-4 text-sm text-gray-600">Add a profile photo or company logo</p>

                <div className="flex items-center gap-4">
                  {image ? (
                    <div className="relative w-24 h-24">
                      <Image
                        src={image.preview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-full"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-gray-400">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="mt-1 text-xs text-gray-500">Upload</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>Max file size: 1MB</p>
                    <p>Recommended: Square image</p>
                  </div>
                </div>
                {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/services"
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Posting..." : "Post Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
