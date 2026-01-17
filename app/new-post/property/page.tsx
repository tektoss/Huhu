"use client"

import { FormEvent, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import NavBar from "@/components/nav-bar"
import { Plus, X, Upload } from "lucide-react"
import { showToast } from "@/utils/showToast"
import { useAuthUser } from "@/lib/auth/hooks/useAuthUser"
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage"
import { 
  collection, 
  addDoc,
  getDoc,
  doc,
  updateDoc,
  Timestamp 
} from "firebase/firestore"
import { storage, db } from "@/lib/firebase/firebase"

interface PropertyFormData {
  propertyTypes: string
  rentPrice: string
  bedbath: string
  leaseDuration: string
  propertyAddie: string
  details: string
  phoneNumber: string
  email: string
  location: {
    town: string
    state: string
    latitude?: number
    longitude?: number
  }
  propertyAmenities: string[]
  lifestyles: string[]
  images: File[]
}

const propertyTypesOptions = ["Apartment", "House", "Flat", "Duplex", "Bungalow", "Studio", "Land", "Office", "Shop"]
const amenitiesOptions = [
  "Balcony",
  "Kitchen",
  "Garden",
  "Parking",
  "Swimming Pool",
  "Gym",
  "Security",
  "Gate",
  "Furnished",
  "Air Conditioning",
]
const lifestyleOptions = [
  "Family-Friendly",
  "Pet-Friendly",
  "Student Accommodation",
  "Corporate Housing",
  "Luxury Living",
  "Affordable",
]
const statesOptions = [
  "Ashanti",
  "Brong Ahafo",
  "Central",
  "Eastern",
  "Greater Accra",
  "Northern",
  "Savanna",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
]

export default function NewPropertyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthUser()
  const propertyId = searchParams.get("propertyId")
  const isEditMode = !!propertyId

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>([])
  
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyTypes: "",
    rentPrice: "",
    bedbath: "",
    leaseDuration: "",
    propertyAddie: "",
    details: "",
    phoneNumber: "",
    email: "",
    location: {
      town: "",
      state: "",
    },
    propertyAmenities: [],
    lifestyles: [],
    images: [],
  })

  // Load property data if in edit mode
  useEffect(() => {
    if (isEditMode && propertyId) {
      const loadProperty = async () => {
        try {
          const docRef = doc(db, "Roommate", propertyId)
          const docSnap = await getDoc(docRef)
          
          if (docSnap.exists()) {
            const data = docSnap.data()
            // Only allow owner to edit
            if (data.vendor?.email !== user?.email) {
              showToast("You can only edit your own properties", "error")
              router.back()
              return
            }
            
            setFormData({
              propertyTypes: data.propertyTypes || "",
              rentPrice: data.rentPrice || "",
              bedbath: data.bedbath || "",
              leaseDuration: data.leaseDuration || "",
              propertyAddie: data.propertyAddie || "",
              details: data.details || "",
              phoneNumber: data.phoneNumber || "",
              email: data.email || "",
              location: data.location || { town: "", state: "" },
              propertyAmenities: data.propertyAmenities || [],
              lifestyles: data.lifestyles || [],
              images: [],
            })
            
            // Show existing images as preview
            if (data.images && Array.isArray(data.images)) {
              setImagePreview(data.images)
            }
          }
        } catch (error) {
          console.error("Error loading property:", error)
          showToast("Error loading property data", "error")
        }
      }
      
      loadProperty()
    }
  }, [isEditMode, propertyId, user?.email])

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-gray-600">Please sign in to post a property</p>
            <a href="/signin" className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
              Sign In
            </a>
          </div>
        </div>
      </main>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locField]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAmenitiesChange = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      propertyAmenities: prev.propertyAmenities.includes(amenity)
        ? prev.propertyAmenities.filter((a) => a !== amenity)
        : [...prev.propertyAmenities, amenity],
    }))
  }

  const handleLifestylesChange = (lifestyle: string) => {
    setFormData((prev) => ({
      ...prev,
      lifestyles: prev.lifestyles.includes(lifestyle)
        ? prev.lifestyles.filter((l) => l !== lifestyle)
        : [...prev.lifestyles, lifestyle],
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const maxSize = 5 * 1024 * 1024 // 5MB

      const validFiles = files.filter((file) => {
        if (file.size > maxSize) {
          showToast(`${file.name} is too large. Max 5MB.`, "error")
          return false
        }
        return true
      })

      if (formData.images.length + validFiles.length > 10) {
        showToast("Maximum 10 images allowed", "error")
        return
      }

      const newFiles = [...formData.images, ...validFiles]
      setFormData((prev) => ({ ...prev, images: newFiles }))

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.propertyTypes || !formData.rentPrice || !formData.propertyAddie || !formData.phoneNumber) {
        showToast("Please fill in all required fields", "error")
        setLoading(false)
        return
      }

      // Upload new images only (existing images in preview are already URLs)
      let imageUrls: string[] = []
      for (const image of formData.images) {
        if (image instanceof File) {
          const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`)
          const snapshot = await uploadBytes(storageRef, image)
          const url = await getDownloadURL(snapshot.ref)
          imageUrls.push(url)
        }
      }

      // Include existing preview images (URLs from edit mode)
      const allImageUrls = [
        ...imagePreview.filter((img) => img.startsWith("http")), // Existing URLs
        ...imageUrls, // New uploads
      ]

      // Prepare document
      const propertyDoc = {
        propertyTypes: formData.propertyTypes,
        rentPrice: parseFloat(formData.rentPrice),
        bedbath: formData.bedbath,
        leaseDuration: formData.leaseDuration,
        propertyAddie: formData.propertyAddie,
        details: formData.details,
        phoneNumber: formData.phoneNumber,
        phone: formData.phoneNumber, // Legacy field
        email: formData.email,
        location: {
          town: formData.location.town,
          state: formData.location.state,
          latitude: formData.location.latitude || 0,
          longitude: formData.location.longitude || 0,
        },
        propertyAmenities: formData.propertyAmenities,
        lifestyles: formData.lifestyles,
        images: allImageUrls,
        image: allImageUrls[0] || "", // Legacy field
        status: "active",
        vendor: {
          firstName: user?.displayName?.split(" ")[0] || "",
          lastName: user?.displayName?.split(" ")[1] || "",
          businessName: "",
          email: user?.email || "",
        },
        userId: user?.email || "",
      }

      if (isEditMode && propertyId) {
        // Update existing property
        const docRef = doc(db, "Roommate", propertyId)
        await updateDoc(docRef, propertyDoc)
        showToast("Property updated successfully!", "success")
        router.push(`/property/${propertyId}`)
      } else {
        // Create new property
        propertyDoc.createdAt = Timestamp.now()
        propertyDoc.datePosted = Timestamp.now()
        const docRef = await addDoc(collection(db, "Roommate"), propertyDoc)
        showToast("Property posted successfully!", "success")
        router.push(`/property/${docRef.id}`)
      }
    } catch (error) {
      console.error("Error saving property:", error)
      showToast("Failed to save property. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <section className="py-8">
        <div className="container px-4 mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold">{isEditMode ? "Edit Property" : "Post a Property"}</h1>
            <p className="text-gray-600">{isEditMode ? "Update your property details" : "List your apartment or property for rent"}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Property Type */}
            <div>
              <label className="block mb-2 font-semibold">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyTypes"
                value={formData.propertyTypes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select Property Type</option>
                {propertyTypesOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 font-semibold">
                Property Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyAddie"
                value={formData.propertyAddie}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main Street, Accra"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">Town</label>
                <input
                  type="text"
                  name="location.town"
                  value={formData.location.town}
                  onChange={handleInputChange}
                  placeholder="e.g., Accra"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">State/Region</label>
                <select
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select State</option>
                  {statesOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Details Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 font-semibold">
                  Rent Price (₵) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  placeholder="5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Beds & Baths</label>
                <input
                  type="text"
                  name="bedbath"
                  value={formData.bedbath}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 bed, 1 bath"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Lease Duration</label>
                <input
                  type="text"
                  name="leaseDuration"
                  value={formData.leaseDuration}
                  onChange={handleInputChange}
                  placeholder="e.g., 1 Year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold">Description</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Describe your property in detail..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block mb-2 font-semibold">Amenities</label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.propertyAmenities.includes(amenity)}
                      onChange={() => handleAmenitiesChange(amenity)}
                      className="w-4 h-4 mr-2"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lifestyles */}
            <div>
              <label className="block mb-2 font-semibold">Lifestyles</label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {lifestyleOptions.map((lifestyle) => (
                  <label key={lifestyle} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.lifestyles.includes(lifestyle)}
                      onChange={() => handleLifestylesChange(lifestyle)}
                      className="w-4 h-4 mr-2"
                    />
                    <span className="text-sm">{lifestyle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., +233501234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 font-semibold">
                Property Images (Max 10)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? (isEditMode ? "Updating..." : "Posting...") : (isEditMode ? "Update Property" : "Post Property")}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
