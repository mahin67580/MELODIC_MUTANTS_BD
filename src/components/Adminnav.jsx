// components/Adminnav.jsx
"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  PlusCircle, 
  Settings, 
  Users,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Adminnav() {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

  const navItems = [
    {
      href: '/dashboard/admindashboard/anlytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      href: '/dashboard/admindashboard/addcourse',
      label: 'Add Course',
      icon: PlusCircle
    },
    {
      href: '/dashboard/admindashboard/managecourse',
      label: 'Manage Course',
      icon: Settings
    },
    {
      href: '/dashboard/admindashboard/manageuser',
      label: 'Manage User',
      icon: Users
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

       <div className='  pl-3  pt2  '>
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