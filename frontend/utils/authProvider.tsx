"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/loadingSpinner";

export default function AuthProvider({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "private" | "public";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/auth/refreshToken");
        
        useAuth.getState().setAuthReady();

        if (mode === "public") {
          router.replace("/");
          return;
        }
      } catch (error) {
        if (mode === "private") {
          router.replace("/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [mode, router]);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return children;
}
