export interface LocationData {
  city: string | null
  country: string | null
  country_code: string | null
  ip: string
}

const LOCATION_CACHE_KEY = 'visitor_location_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function getVisitorLocation(): Promise<LocationData> {
  // Check if we're in browser
  if (typeof window === 'undefined') {
    return {
      city: null,
      country: null,
      country_code: null,
      ip: 'unknown'
    }
  }

  // Try to get cached location
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()

      // Use cache if less than 24 hours old
      if (now - timestamp < CACHE_DURATION) {
        return data
      }
    }
  } catch (e) {
    // Ignore cache errors
  }

  // Fetch new location data
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    const locationData: LocationData = {
      city: data.city || null,
      country: data.country_name || null,
      country_code: data.country_code || null,
      ip: data.ip || 'unknown'
    }

    // Cache the result
    try {
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
        data: locationData,
        timestamp: Date.now()
      }))
    } catch (e) {
      // Ignore localStorage errors
    }

    return locationData
  } catch (error) {
    console.warn('Failed to fetch location, using fallback:', error)

    // Return fallback data
    return {
      city: null,
      country: null,
      country_code: null,
      ip: 'unknown'
    }
  }
}

// Generate session ID for anonymous users
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('visitor_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('visitor_session_id', sessionId)
  }
  return sessionId
}
