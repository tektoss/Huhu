import { db } from "@/lib/firebase/firebase";
import { FirebaseProduct } from "@/lib/firebase/firestore";
import { collection, doc, getDoc, getDocs, limit, query, Timestamp, where } from "firebase/firestore";

export const fetchProductsByCategory = async (category: string) => {
    
    const validCategories = [
      'electronics',
      'vehicles',
      'books',
      'gaming',
      'furniture',
      'jobs',
      'home',
      'property',
      'properties',
      'fashion',
      'cosmetics'
    ];

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    let q;
    let collectionName = "products";
    
    // Use Roommate collection for property/properties categories
    if (category === "property" || category === "properties") {
      collectionName = "Roommate";
      q = collection(db, collectionName);
    }
    else if(validCategories.includes(category)){
      q = query(
        collection(db, "products"),
        where("category", "==", category)
        );
    }
    else if(!validCategories.includes(category) && category === "new"){
      q = query(
        collection(db, "products"),
        where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo)),
        where("createdAt", "<=", Timestamp.fromDate(now))
      )
    }
    else {
      q = collection(db, "products")
    }
  
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseProduct[]
  
    return products;
  };

   export interface jobListing {
     // New format fields
     applicationDeadline?: string;
     category?: string;
     contact?: { email?: string; phone?: string; };
     createdAt?: any;
     company?: string;
     description?: string;
     employmentType?: string;
     experience?: string;
     externalLink?: string;
     id: string;
     image?: string;
     isRemote?: boolean;
     salary?: string;
     salaryDetail?: { max?: number; min?: number; };
     salaryDetails?: { salaryMin?: number; salaryMax?: number; };
     skills?: string[];
     title?: string;
     email?: string;
     phone?: string;
     location?: { region?: string; suburb?: string; state?: string; town?: string; country?: string; coordinates?: any; };
     vendor?: { uid?: string; image?: string; name?: string; Company?: string; photoUrl?: string; addresss?: string; };
     // Legacy/alternate format fields
     name?: string;
     datePosted?: any;
     lastEdited?: any;
     PhoneNumber?: string;
     companytEmail?: string;
     consultType?: string;
     jDescription?: string;
     jExpectation?: string;
     jComBenefit?: string;
     jcomBlurb?: string;
     jMinEducation?: string;
     jobType?: string;
     jtravelReq?: string;
     status?: string;
     postedFrom?: string;
     region?: string;
     suburb?: string;
   }

   // Consultant/Service listing interface
   export interface ConsultantListing {
     id: string;
     // New web format fields
     title?: string;
     company?: string;
     serviceTypes?: string[];
     expertise?: string[];
     description?: string;
     email?: string;
     phone?: string;
     location?: { region?: string; suburb?: string; state?: string; town?: string };
     image?: string;
     createdAt?: any;
     vendor?: any;
     // Legacy mobile format fields
     Expertise?: string;
     details?: string;
     consultantEmail?: string;
     PhoneNumber?: string;
     serviceType?: string;
     datePosted?: any;
   }

   // Property/Apartment listing interface
   export interface PropertyListing {
     id: string;
     // Core fields
     title?: string;
     propertyTypes?: string;
     rentPrice?: string;
     bedbath?: string;
     leaseDuration?: string;
     details?: string;
     description?: string;
     propertyAddie?: string;
     propertyAmenities?: string[];
     lifestyles?: string[];
     images?: string[];
     image?: string;
     // Location
     location?: {
       region?: string;
       state?: string;
       town?: string;
       country?: string;
       coordinates?: { latitude?: number; longitude?: number };
     };
     // Contact
     phoneNumber?: string;
     phone?: string;
     email?: string;
     // Metadata
     status?: string;
     postedFrom?: string;
     datePosted?: any;
     lastEdited?: any;
     createdAt?: any;
     viewCount?: any[];
     vendor?: {
       uid?: string;
       firstName?: string;
       lastName?: string;
       photoUrl?: string;
       fullName?: string;
     };
   }

   export const fetchJobList = async () => {
      // const validCategories = ['Services', 'Jobs'];

      let q;
    
      // if(validCategories.includes(type)){
      //   q = query(
      //     collection(db, "jobListing"),
      //     where("category", "==", type.toLowerCase())
      //   );
      // } else  {
      //   q = collection(db, "jobListing")
      // }

      q = collection(db, "Job")

      const querySnapshot = await getDocs(q);

      const jobs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as jobListing[]
    
      return jobs;
   }

   // Fetch consultants/services from Consultants collection
   export const fetchConsultantList = async () => {
      const q = collection(db, "Consultants");
      const querySnapshot = await getDocs(q);

      const consultants = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ConsultantListing[];
    
      return consultants;
   }

   // Fetch properties/apartments from properties collection
   export const fetchPropertyList = async () => {
      const q = collection(db, "Roommate");
      const querySnapshot = await getDocs(q);

      const properties = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PropertyListing[];
    
      return properties;
   }
  

  // returns date in format eg. May 22, 2025
  export const formatDate = (dateString: string): string | null => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
  
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  export const getUserListings = async (userId: string) => {
    const q = query(
      collection(db, "products"),
      where("vendor.uid", "==", userId)
    )
  
    const querySnapshot = await getDocs(q)
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirebaseProduct[]
    
    return listings
  }


  export const getUserJobs = async (userId: string) => {
    const q = query(
      collection(db, "Job"),
      where("vendor.uid", "==", userId)
    )
  
    const querySnapshot = await getDocs(q)
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as jobListing[]
    
    return jobs
  }


  export const getUserData = async (userId: string) => {
    const docRef = doc(db, "vendors", userId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;

    const pickString = (sources: any[], keys: string[]): string => {
      for (const source of sources) {
        if (!source || typeof source === "string") continue;
        for (const key of keys) {
          const value = source[key];
          if (typeof value === "string" && value.trim()) {
            return value.trim();
          }
        }
      }
      return "";
    };

    const pickCoordinates = (sources: any[]) => {
      for (const source of sources) {
        if (!source || typeof source === "string") continue;
        if (source.coordinates) return source.coordinates;
        if (source.location && source.location.coordinates) return source.location.coordinates;
      }
      return undefined;
    };

    const nameCandidates = data
      ? [
          data.displayName,
          data.name,
          data.fullName,
          [data.firstName, data.lastName].filter(Boolean).join(" ").trim(),
          data.companyName,
          data.company,
          data.username,
        ]
      : [];
    const nameFromData = nameCandidates.find((value) => typeof value === "string" && value.trim()) || "";

    const emailCandidates = data
      ? [data.email, data.contactEmail, data.contact?.email, data.primaryEmail]
      : [];
    const emailFromData = emailCandidates.find((value) => typeof value === "string" && value.trim()) || "";

    const phoneCandidates = data
      ? [data.phone, data.contactPhone, data.contact?.phone, data.phoneNumber, data.primaryPhone]
      : [];
    const phoneFromData = phoneCandidates.find((value) => typeof value === "string" && value.trim()) || "";

    const photoCandidates = data
      ? [data.photoURL, data.photoUrl, data.image, data.avatar, data.profilePicture, data.photo]
      : [];
    const photoFromData = photoCandidates.find((value) => typeof value === "string" && value.trim()) || "";

    const baseLocationSources = [data?.location, data?.address, data];
    const baseRegion = pickString(baseLocationSources, ["region", "state", "province"]);
    const baseSuburb = pickString(baseLocationSources, ["suburb", "town", "city", "district"]);
    const baseCountry = pickString(baseLocationSources, ["country"]);
    const baseCoordinates = pickCoordinates(baseLocationSources);
    const baseLabel = typeof data?.location === "string" ? data.location : typeof data?.propertyLocation === "string" ? data.propertyLocation : "";

    const needsFallback =
      !docSnap.exists() ||
      !nameFromData ||
      !photoFromData ||
      !emailFromData ||
      !phoneFromData ||
      (!baseRegion && !baseSuburb);

    const fetchFallbackProfile = async () => {
      try {
        const productQuery = query(collection(db, "products"), where("vendor.uid", "==", userId), limit(1));
        const productSnapshot = await getDocs(productQuery);
        if (!productSnapshot.empty) {
          const productData = productSnapshot.docs[0].data() as FirebaseProduct;
          return {
            displayName:
              productData?.vendor?.name ||
              productData?.vendor?.displayName ||
              productData?.vendor?.fullName ||
              "",
            photoURL:
              productData?.vendor?.image ||
              productData?.vendor?.photoURL ||
              productData?.vendor?.photoUrl ||
              productData?.vendor?.avatar ||
              "",
            email:
              (productData as any)?.email ||
              (productData as any)?.contactEmail ||
              (productData as any)?.contact?.email ||
              "",
            phone:
              (productData as any)?.phone ||
              (productData as any)?.contactPhone ||
              (productData as any)?.contact?.phone ||
              "",
            location: productData?.location,
            propertyLocation: productData?.propertyLocation,
            createdAt: productData?.createdAt,
          };
        }

        const jobQuery = query(collection(db, "Job"), where("vendor.uid", "==", userId), limit(1));
        const jobSnapshot = await getDocs(jobQuery);
        if (!jobSnapshot.empty) {
          const jobData = jobSnapshot.docs[0].data() as jobListing;
          return {
            displayName: jobData?.vendor?.name || jobData?.company || "",
            photoURL: jobData?.vendor?.image || "",
            email: jobData?.email || jobData?.contact?.email || "",
            phone: jobData?.phone || jobData?.contact?.phone || "",
            location: jobData?.location || { region: jobData?.region, suburb: jobData?.suburb },
            createdAt: jobData?.createdAt,
          };
        }
      } catch (error) {
        console.error("Error fetching fallback profile:", error);
      }

      return null;
    };

    const fallbackProfile = needsFallback ? await fetchFallbackProfile() : null;
    const fallbackSources = fallbackProfile
      ? [fallbackProfile.location, fallbackProfile]
      : [];

    const fallbackRegion = pickString(fallbackSources, ["region", "state", "province"]);
    const fallbackSuburb = pickString(fallbackSources, ["suburb", "town", "city", "district"]);
    const fallbackCountry = pickString(fallbackSources, ["country"]);
    const fallbackCoordinates = pickCoordinates(fallbackSources);
    const fallbackLabel = fallbackProfile?.propertyLocation || (typeof fallbackProfile?.location === "string" ? fallbackProfile.location : "");

    const displayName = (nameFromData || fallbackProfile?.displayName || "").trim() || "Unknown User";
    const email = emailFromData || fallbackProfile?.email || "";
    const phone = phoneFromData || fallbackProfile?.phone || "";
    const photoURL = photoFromData || fallbackProfile?.photoURL || "/placeholder.svg?height=96&width=96";

    const region = baseRegion || fallbackRegion;
    const suburb = baseSuburb || fallbackSuburb;
    const country = baseCountry || fallbackCountry;
    const coordinates = baseCoordinates || fallbackCoordinates;
    const locationLabel = baseLabel || fallbackLabel;

    const location: Record<string, any> = {
      region: region || "",
      suburb: suburb || "",
    };

    if (country) {
      location.country = country;
    }

    if (coordinates) {
      location.coordinates = coordinates;
    }

    if (locationLabel) {
      location.label = locationLabel;
    }

    const baseData = (data ?? {}) as Record<string, any>;

    return {
      ...baseData,
      uid: baseData.uid || userId,
      displayName,
      firstName: baseData.firstName,
      lastName: baseData.lastName,
      email,
      phone,
      photoURL,
      location,
      createdAt: baseData.createdAt ?? fallbackProfile?.createdAt ?? null,
    };
  };