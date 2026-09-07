"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { reaction } from "mobx";

import LoadingSpinner from "@/components/LoadingSpinner";
import authStore from "@/stores/authStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!authStore.initialized) {
      authStore.fetchUser();
    }
  }, []);

  useEffect(() => {
    const dispose = reaction(
      () => ({
        initialized: authStore.initialized,
        user: authStore.user,
      }),
      ({ initialized, user }) => {
        if (initialized && !user) {
          router.replace("/accounts/login");
        }
      },
    );

    return dispose;
  }, [router]);

  if (!authStore.initialized) {
    return <LoadingSpinner />;
  }

  if (!authStore.user) {
    return <LoadingSpinner />;
  }

  return children;
}

export default observer(ProtectedRoute);
