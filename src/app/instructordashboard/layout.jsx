
import Instructornav from '@/components/Instructornav'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default async function Layout({ children }) {

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2 p-3 h-screen sticky top-0">
        <Link href={"/"}>
          <div className="flex items-center text-2xl m-5 text-blue-600">
            <BarChart3 size={24} />
            <span className="font-medium">Dashboard</span>
          </div>
        </Link>

       <Instructornav />
       
      </div>
      <div className="col-span-10">
       
        {children}
      </div>
    </div>
  );
}
