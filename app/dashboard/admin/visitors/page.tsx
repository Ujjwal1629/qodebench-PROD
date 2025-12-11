import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VisitorsTable } from '@/components/admin/visitors-table'
import { VisitorsHeader } from '@/components/admin/visitors-header'

async function isAdminUser(userId: string, userEmail: string | undefined, supabase: any): Promise<boolean> {
  // First check: admin emails from env (fastest check)
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
    return true
  }

  // Second check: is_admin flag in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (profile?.is_admin) return true

  return false
}

export default async function VisitorsPage() {
  const supabase = await createClient()

  // Check admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  // Check if user is admin (via email env var OR is_admin flag)
  const isAdmin = await isAdminUser(user.id, user.email, supabase)
  if (!isAdmin) redirect('/dashboard')

  // Fetch recent visitors (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: visitors } = await supabase
    .from('visitor_logs')
    .select('*')
    .gte('visited_at', thirtyDaysAgo.toISOString())
    .order('visited_at', { ascending: false })
    .limit(1000)

  return (
    <div className="container mx-auto py-8">
      <VisitorsHeader totalCount={visitors?.length || 0} />
      <VisitorsTable visitors={visitors || []} />
    </div>
  )
}
