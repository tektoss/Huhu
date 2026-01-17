export const getFirstThreeLetters = (input: string | null) => {
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return '000';
    }
  
    return input.trim().slice(0, 3).toLowerCase();
  };

  export function getPostedTimeFromFirestore(timestamp: any): string {
    if (!timestamp || typeof timestamp.toDate !== "function") return "posted some time ago";
  
    const date = timestamp.toDate();
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
  
    if (diff < 60) return "posted just now";
    if (diff < 3600) return `posted ${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `posted ${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `posted ${(Math.floor(diff / 86400) === 1) ? "1 day ago" : `${Math.floor(diff / 86400)} days ago`}`;
    if (diff < 31536000) return `posted ${Math.floor(diff / 2592000)} months ago`;
    return "posted a long time ago";
  }

  // Calculate distance between two coordinates using Haversine formula (in km)
  export function calculateDistance(
    coord1: { latitude?: number; longitude?: number },
    coord2: { latitude?: number; longitude?: number }
  ): number | null {
    if (!coord1?.latitude || !coord1?.longitude || !coord2?.latitude || !coord2?.longitude) {
      return null;
    }

    const R = 6371; // Earth's radius in km
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
        Math.cos(coord2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  }