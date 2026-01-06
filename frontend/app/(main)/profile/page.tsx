"use client";

import { authApi } from "@/apis/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const router = useRouter();
  const clearAccessToken = useAuth((s) => s.clearAccessToken);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("user-storage");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      clearAccessToken();

      router.replace("/login");
    }
  };

  return (
    <div>
      <h1>Profile na eiei</h1>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
