"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axios } from "@/utils/axios";
import { useAuth } from "@/hooks/useAuth";

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
    if (mode === "public") {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
 
        await axios.get("/auth/refreshToken");

        useAuth.getState().setAuthReady();
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [mode, router]);

  if (loading) return null;

  return children;
}
