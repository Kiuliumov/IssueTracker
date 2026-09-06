"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import authStore from "@/stores/authStore";
import LoadingSpinner from "@/components/LoadingSpinner";

type GuestGuardProps = {
  children: React.ReactNode;
};

function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    authStore.fetchUser();
  }, []);

  useEffect(() => {
    if (mounted && authStore.initialized && authStore.user) {
      router.replace("/dashboard");
    }
  }, [mounted, router, authStore.initialized, authStore.user]);

  if (!mounted || !authStore.initialized) {
    return <LoadingSpinner />;
  }

  if (authStore.user) {
    return null;
  }

  return children;
}

export default observer(GuestGuard);
