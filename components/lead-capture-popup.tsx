'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { getOrCreateSessionId } from '@/lib/utils/get-location'

export function LeadCapturePopup() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Don't show to logged-in users
    if (user) return

    // Check if already submitted
    const hasSubmitted = localStorage.getItem('lead_captured')
    if (hasSubmitted) return

    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setOpen(true)
    }, 10000) // 10 seconds delay

    return () => clearTimeout(timer)
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient()
    const sessionId = getOrCreateSessionId()

    await supabase.from('visitor_logs').insert({
      session_id: sessionId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      page_url: window.location.pathname,
      page_title: document.title,
      ip_address: null,
      city: null,
      country: null,
      country_code: null,
      user_agent: navigator.userAgent,
      device_type: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    })

    localStorage.setItem('lead_captured', 'true')
    setSubmitted(true)
    setTimeout(() => setOpen(false), 2000)
  }

  if (user) return null // Don't show to logged-in users

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Free Access to Premium Challenges!</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-green-600 font-semibold">Thank you! We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full">
              Get Access
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                localStorage.setItem('lead_captured', 'dismissed')
                setOpen(false)
              }}
            >
              Maybe Later
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
