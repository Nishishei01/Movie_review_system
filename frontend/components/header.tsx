'use client'

import { useAuth } from "@/hooks/useAuth"
import { useUser } from "@/hooks/useUser"
import { UserCircleIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { authApi } from "@/apis/auth";
import { SearchAutocomplete } from "./searchBar"
import { AuthProps } from "@/types"

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
    <header className="sticky top-0 z-50 w-full pt-1 px-2 md:px-0">
      <nav className="flex justify-between items-center text-center max-w-[1400px] mx-auto my-0.5 rounded-2xl md:rounded-4xl h-14 md:h-15 px-4 md:px-8 border border-gray-300 shadow-xl/4 bg-white ">
        <div className="flex-[0.5] md:flex-1 flex justify-start">
          <Link href='/'>
            <h1 className="font-bold text-lg md:text-xl">Movie <span className="text-purple-700 hidden sm:inline">Review</span></h1>
          </Link>
        </div>
        <div className="flex-[2] md:flex-1 flex justify-center w-full max-w-[200px] md:max-w-none px-2 md:px-0">
            {/* <input type="text" placeholder="Search User" /> */}
            <SearchAutocomplete<AuthProps.SearchUserType>
              placeholder="Search user"
              fetcher={(q) =>
                authApi.searchUser({ query: q }).then(r => r.data.result)
              }
              getOptionLabel={(item) =>
                `${item.firstName} ${item.lastName}`
              }
              getOptionValue={(item) => item.id}
              onSelect={(item) => {
              router.push(`/profile/${item.id}`)
              }}
            />
        </div>
        <div className="flex-[0.5] md:flex-1 flex justify-end">
          <div className="relative group flex items-center">
            <button className="flex cursor-pointer items-center justify-center gap-0 md:gap-2 text-white bg-purple-700 rounded-[10px] h-[33px] px-2 md:px-4">
              <UserCircleIcon className="h-6 w-6 text-white" />
              <span className="hidden md:inline">{displayName}</span>
              <ChevronUpIcon className="hidden md:block h-5 w-5 text-white rotate-180 transition-all group-hover:rotate-0" />
            </button>

            {/* dropdown */}
            <div className="absolute right-0 top-full hidden group-hover:flex flex-col w-40 pt-2 z-50">
              <div className="bg-white shadow-lg rounded-xl flex flex-col overflow-hidden border border-gray-100">
                <Link 
                  href={`/profile/${userData?.id}`}
                  className="px-4 py-3 hover:bg-gray-50 text-gray-700 cursor-pointer transition text-sm font-medium"
                >
                  Profile
                </Link>
                <div className="h-px bg-gray-100 w-full"></div>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer transition text-sm font-medium w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}