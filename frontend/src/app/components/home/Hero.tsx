"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";

import authStore from "@/stores/authStore";

function Hero() {
  const isAuthenticated = Boolean(authStore.user);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-[75vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-6 rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-400">
          {isAuthenticated
            ? `Welcome back, ${authStore.user?.username}`
            : "Simple issue tracking for development teams"}
        </span>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {isAuthenticated ? (
            <>
              Keep your projects.
              <br />
              <span className="text-gray-400">Moving forward.</span>
            </>
          ) : (
            <>
              Track issues.
              <br />
              <span className="text-gray-400">Ship better software.</span>
            </>
          )}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
          {isAuthenticated
            ? "Manage your projects, track issues, and keep your development work organized."
            : "IssueTracker helps development teams organize projects, track bugs, assign work, and keep everyone aligned."}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/accounts/register"
                className="rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
              >
                Get Started
              </Link>

              <Link
                href="/accounts/login"
                className="rounded-lg border border-gray-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default observer(Hero);