'use client'

import { useAuth } from "@/hooks/useAuth"
import { useUser } from "@/hooks/useUser"
import { UserCircleIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { authApi } from "@/apis/auth";

export function Header() {  
  const userData = useUser((state) => state.userData)
  const clearAccessToken = useAuth((s) => s.clearAccessToken);

  const fullName = userData ? `${userData.firstName} ${userData.lastName}` : ""
  const displayName = fullName.length > 12 
    ? `${userData?.firstName}...`
    : fullName

  const router = useRouter();
  
  async function handleLogout() {
    try {
          await authApi.logout();
          localStorage.removeItem("user-storage");
        } catch (error) {
          console.error("Logout API failed", error);
        } finally {
          clearAccessToken();
    
          router.replace("/login");
        }
  }
    
  return (
    <header>
      <nav className="flex justify-between items-center text-center mx-45 my-0.5 rounded-4xl h-15 px-15 border-x-1 border-t-1 border-b-1 border-gray-300 shadow-xl/4">
        <div className="flex-1 flex justify-start">
          <Link href='/'>
            <h1 className="font-bold text-xl">Movie <span className="text-purple-700">Review</span></h1>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
            <input type="text" placeholder="Search User" />
        </div>
        <div className="flex-1 flex justify-end group">
            <button className=" flex cursor-pointer items-center gap-2 text-white bg-purple-700 rounded-[10px] h-[33px] px-4">
              <UserCircleIcon className="h-6 w-6 text-white" />
              {displayName}
              <ChevronUpIcon className="h-5 w-5 text-white rotate-180 transition-all group-hover:rotate-0" />
            </button>

            {/* dropdown */}
            <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-lg w-40 mt-8 transition-all">
                <Link 
                  href='/profile'
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer transition rounded-lg"
                >
                  Profile
                </Link>
                <span 
                  className="text-center px-4 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer transition rounded-lg"
                  onClick={handleLogout}>
                  Logout
                </span>
            </div>
        </div>
      </nav>
    </header>
  )
}