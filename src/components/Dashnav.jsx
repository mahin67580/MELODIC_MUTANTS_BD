// components/Dashnav.jsx
"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Calendar, 
  BookOpen, 
  Heart,
  ChevronRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Dashnav() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

  const navItems = [
    {
      href: '/dashboard/userdashboard/anlytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      href: '/dashboard/userdashboard/mybookings',
      label: 'My Bookings',
      icon: Calendar
    },
    {
      href: '/dashboard/userdashboard/mycourses',
      label: 'My Courses',
      icon: BookOpen
    },
    {
      href: '/dashboard/userdashboard/wishlist',
      label: 'Wish List',
      icon: Heart
    }
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        
        return (
          <Button
            key={item.href}
            asChild
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-12",
              active && "bg-blue-50 text-blue-700 border-blue-200 border"
            )}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}