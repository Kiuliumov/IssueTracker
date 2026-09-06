"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import FormField from "../components/FormField";
import GuestGuard from "../../../components/GuestGuard";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    try {
      await api.post("/accounts/login/", {
        username,
        password,
      });

      router.push("/dashboard");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <GuestGuard>
      <AuthCard
        title="Sign in to your account"
        description="Welcome back. Enter your credentials to continue."
        footer={
          <>
            <p>Don&apos;t have an account?</p>{" "}
            <Link
              href="/accounts/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Create an account
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          <FormField
            id="username"
            name="username"
            label="Username"
            type="text"
            required
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-200"
              >
                Password
              </label>

              <Link
                href="/accounts/forgot-password"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>

            <div className="mt-2">
              <FormField
                id="password"
                name="password"
                label=""
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>

          <Button type="submit">Sign in</Button>
        </form>
      </AuthCard>
    </GuestGuard>
  );
}