"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  name: string;
  href: string;
};

type MobileMenuProps = {
  items: NavItem[];
};

export default function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
        >
          <span className="absolute -inset-0.5" />

          <span className="sr-only">
            {open ? "Close main menu" : "Open main menu"}
          </span>

          {open ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-6"
            >
              <path
                d="M6 18 18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-6"
            >
              <path
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-16 z-50 w-full bg-gray-950 sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}