"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/LoadingSpinner";
import authStore from "@/stores/authStore";

type GuestGuardProps = {
  children: React.ReactNode;
};

function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  useEffect(() => {
    authStore.fetchUser();
  }, []);

  useEffect(() => {
    if (authStore.initialized && authStore.user) {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!authStore.initialized) {
    return <LoadingSpinner />;
  }

  if (authStore.user) {
    return null;
  }

  return children;
}

export default observer(GuestGuard);
