/**
 * Calculates the Haversine distance between two points in kilometers.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates travel time based on distance and mode.
 * Driving: ~30 km/h (conservative for cities/Bali)
 * Walking: ~5 km/h
 */
export function estimateTravelTime(distanceKm: number, mode: 'drive' | 'walk'): number {
  const speed = mode === 'drive' ? 30 : 5;
  return (distanceKm / speed) * 60; // Returns minutes
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

/**
 * Check if coordinates are valid (not default/placeholder values).
 */
export function isValidCoord(lat: number, lng: number): boolean {
  if (lat === 0 && lng === 0) return false;
  if (lat === -8.4 && lng === 115.2) return false;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return false;
  return true;
}

/**
 * Extracts coordinates from a Google Maps URL.
 * Supports many URL patterns:
 *   - @lat,lng (standard)
 *   - !3dlat!4dlng (long/embed URLs)
 *   - ?ll=lat,lng or ?q=lat,lng
 *   - /place/.../@lat,lng
 *   - data=!...!3dlat!4dlng
 *   - directions/lat,lng
 *   - /search/lat,lng
 */
export function extractCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  if (!url || typeof url !== 'string') return null;

  // Decode URL first to handle encoded characters
  const decoded = decodeURIComponent(url);

  // Pattern 1: @lat,lng (most common — map center or place pin)
  const p1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
  const m1 = decoded.match(p1);
  if (m1) {
    const lat = parseFloat(m1[1]);
    const lng = parseFloat(m1[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // Pattern 2: !3dlat!4dlng (long URLs / data parameters)
  const p2 = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
  const m2 = decoded.match(p2);
  if (m2) {
    const lat = parseFloat(m2[1]);
    const lng = parseFloat(m2[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // Pattern 3: ?ll=lat,lng or &ll=lat,lng or ?q=lat,lng or &q=lat,lng
  const p3 = /[?&](?:ll|q|center|query)=(-?\d+\.?\d*)[,+](-?\d+\.?\d*)/;
  const m3 = decoded.match(p3);
  if (m3) {
    const lat = parseFloat(m3[1]);
    const lng = parseFloat(m3[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // Pattern 4: /place/.../@lat,lng or /dir/lat,lng
  const p4 = /\/(?:place|dir|search)\/[^/]*\/(-?\d+\.?\d*),(-?\d+\.?\d*)/;
  const m4 = decoded.match(p4);
  if (m4) {
    const lat = parseFloat(m4[1]);
    const lng = parseFloat(m4[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // Pattern 5: Bare lat,lng in URL path (e.g., maps.google.com/maps?q=-8.5069,115.2624)
  const p5 = /(-?\d{1,3}\.\d{3,})[,/](-?\d{1,3}\.\d{3,})/;
  const m5 = decoded.match(p5);
  if (m5) {
    const lat = parseFloat(m5[1]);
    const lng = parseFloat(m5[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  return null;
}
