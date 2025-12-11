'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from './use-auth'
import { getOrCreateSessionId } from '@/lib/utils/get-location'
import { createClient } from '@/lib/supabase/client'

export function usePageTracking() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<{ username: string | null; phone: string | null } | null>(null)

  // Fetch profile data when user is logged in
  useEffect(() => {
    if (user) {
      const supabase = createClient()
      supabase
        .from('profiles')
        .select('username, phone')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfileData(data)
        })
    } else {
      setProfileData(null)
    }
  }, [user])

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const supabase = createClient()

        // Get device info
        const userAgent = navigator.userAgent
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
        const deviceType = isMobile ? 'mobile' : 'desktop'

        // Session ID for anonymous users
        const sessionId = user ? null : getOrCreateSessionId()

        // Track page view (without location for now - API has CORS/rate limit issues)
        const { error } = await supabase.from('visitor_logs').insert({
          user_id: user?.id || null,
          session_id: sessionId,
          name: profileData?.username || null,
          email: user?.email || null,
          phone: profileData?.phone || null,
          page_url: pathname,
          page_title: document.title,
          referrer: document.referrer || null,
          ip_address: null,
          city: null,
          country: null,
          country_code: null,
          user_agent: userAgent,
          device_type: deviceType,
        })

        if (error) {
          console.warn('Failed to track page view:', error)
        }
      } catch (error) {
        // Silently fail - don't break user experience
        console.warn('Page tracking error:', error)
      }
    }

    trackPageView()
  }, [pathname, user, profileData])
}
