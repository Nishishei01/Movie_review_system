import Posts from "@/components/Posts/posts";
import { serverRefreshToken } from "@/utils/token";
import { cookies } from "next/headers";

export default async function Home() {

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } 

  let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/`, {
    headers: headers
  })
  
  if (res.status === 403) {
    const newToken = await serverRefreshToken();

    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/`, {
    headers: {'Authorization': `Bearer ${newToken}`}
  })
  }

  const posts = await res.json()
  const result = posts.result
  
  return (
    <>
      <Posts posts={result} />
    </>
  );
}
