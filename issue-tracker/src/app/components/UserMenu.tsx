"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import authStore from "@/stores/authStore";

function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    authStore.fetchUser();
  }, []);

  const handleLogout = async () => {
    await authStore.logout();
    setOpen(false);
    router.push("/accounts/login");
  };

  if (authStore.loading) {
    return null;
  }

  if (!authStore.user) {
    return (
      <Link
        href="/accounts/login"
        className="rounded-md bg-indigo-500 px-4 py-2 mx-3 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        Sign in
      </Link>
    );
  }

  const initials = authStore.user.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative ml-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex rounded-full bg-gray-800 text-sm focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>

        <div className="flex size-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
          {initials}
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/20"
          role="menu"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">
              {authStore.user.username}
            </p>

            <p className="truncate text-xs text-gray-400">
              {authStore.user.email}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            role="menuitem"
          >
            Your Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default observer(UserMenu);