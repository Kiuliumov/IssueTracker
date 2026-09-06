"use client";

import { useState } from "react";
import Link from "next/link";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

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
          JD
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/20 focus:outline-none"
          role="menu"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-xs text-gray-400">john@example.com</p>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            role="menuitem"
          >
            Your Profile
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
            role="menuitem"
          >
            Settings
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              // We'll connect this to Django logout later.
            }}
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
