"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import authStore from "@/stores/authStore";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!authStore.initialized) {
      authStore.fetchUser();
      return;
    }

    if (authStore.user) {
      router.replace("/dashboard");
    } else {
      router.replace("/accounts/login");
    }
  }, [router]);

  return null;
}
