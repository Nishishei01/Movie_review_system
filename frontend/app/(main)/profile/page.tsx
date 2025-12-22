'use client'
import { authApi } from "@/apis/auth";
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter();
  async function handleLogout() {
    try {
      await authApi.logout();
      localStorage.removeItem("accessToken")
      router.push('/login')
    } catch (error) {
      console.log("Logout Failed", error);
    }
  }

  return (
    <div>
      <h1>Profile na eiei</h1>
      <button
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
