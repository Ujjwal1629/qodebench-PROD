'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Mail, MessageCircle } from 'lucide-react'

interface Visitor {
  id: string
  user_id: string | null
  session_id: string | null
  name: string | null
  email: string | null
  phone: string | null
  page_url: string
  city: string | null
  country: string | null
  device_type: string | null
  visited_at: string
}

export function VisitorsTable({ visitors }: { visitors: Visitor[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'logged-in' | 'anonymous'>('all')

  // Filter visitors
  const filtered = visitors.filter(v => {
    const matchesSearch =
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase()) ||
      v.phone?.includes(search)

    const matchesFilter =
      filter === 'all' ? true :
      filter === 'logged-in' ? v.user_id !== null :
      v.user_id === null

    return matchesSearch && matchesFilter
  })

  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Page', 'City', 'Country', 'Device', 'Visited At'].join(','),
      ...filtered.map(v => [
        v.name || 'Anonymous',
        v.email || '',
        v.phone || '',
        v.page_url,
        v.city || '',
        v.country || '',
        v.device_type || '',
        new Date(v.visited_at).toLocaleString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitors-${Date.now()}.csv`
    a.click()
  }

  // Unique contacts (by email/phone)
  const uniqueContacts = Array.from(
    new Map(
      filtered
        .filter(v => v.email || v.phone)
        .map(v => [v.email || v.phone, v])
    ).values()
  )

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Visitors</p>
          <p className="text-2xl font-bold">{filtered.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Logged-in</p>
          <p className="text-2xl font-bold">{filtered.filter(v => v.user_id).length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Anonymous</p>
          <p className="text-2xl font-bold">{filtered.filter(v => !v.user_id).length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Unique Contacts</p>
          <p className="text-2xl font-bold">{uniqueContacts.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visitors</SelectItem>
            <SelectItem value="logged-in">Logged-in Only</SelectItem>
            <SelectItem value="anonymous">Anonymous Only</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Visited At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell>
                  {visitor.name || 'Anonymous'}
                  {visitor.user_id && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      User
                    </span>
                  )}
                </TableCell>
                <TableCell>{visitor.email || '-'}</TableCell>
                <TableCell>{visitor.phone || '-'}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {visitor.page_url}
                </TableCell>
                <TableCell>
                  {visitor.city && visitor.country
                    ? `${visitor.city}, ${visitor.country}`
                    : visitor.country || '-'
                  }
                </TableCell>
                <TableCell className="capitalize">{visitor.device_type}</TableCell>
                <TableCell>
                  {new Date(visitor.visited_at).toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {visitor.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`mailto:${visitor.email}`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                    {visitor.phone && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          window.open(`https://wa.me/${visitor.phone?.replace(/[^0-9]/g, '') || ''}`)
                        }
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
