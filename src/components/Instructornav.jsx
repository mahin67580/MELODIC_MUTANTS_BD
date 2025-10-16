// components/Instructornav.jsx
"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  PlusCircle,
  Settings,
  User,
  BookOpen,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Instructornav() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname.startsWith(path) // Use startsWith to handle nested routes
  }

  const navItems = [
    {
      href: '/instructordashboard/anlytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'View your course performance'
    },
    {
      href: '/instructordashboard/addcourse',
      label: 'Add Course',
      icon: PlusCircle,
      description: 'Create new course'
    },
    {
      href: '/instructordashboard/managecourse',
      label: 'Manage Courses',
      icon: Settings,
      description: 'Edit existing courses'
    },
    {
      href: '/instructordashboard/updatebio',
      label: 'Update Profile',
      icon: User,
      description: 'Edit your bio and info'
    },
    // {
    //   href: '/',
    //   label: 'Home',
    //   icon: BookOpen,
    //   description: 'Back to home page'
    // }
  ]

  return (
    <nav className="space-y-2   ">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)

        return (
          <Button
            key={item.href}
            asChild
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-14 px-4",
              active && "bg-blue-50 text-blue-700 border-blue-200 border"
            )}
          >
            <Link href={item.href}>
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
              {active && <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />}
            </Link>
          </Button>
        )
      })}
      <div className='  p-4   '>
        <button>
          <Link href='/'>
            <div className="flex items-center gap-3 text-red-600">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Home</div>
                <div className="text-xs text-muted-foreground">Back to home page</div>
              </div>
            </div>
          </Link>
        </button>
      </div>

    </nav>
  )
}