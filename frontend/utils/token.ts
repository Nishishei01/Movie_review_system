import { cookies } from "next/headers";

export async function serverRefreshToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`, {
    headers: { 
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${refreshToken}`
    },
    credentials: "include",
  })
  const data = await res.json();
  
  return data.accessToken
}