"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import FormField from "../components/FormField";
import GuestGuard from "@/components/GuestGuard";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post("/accounts/register/", {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const data = error.response.data;

        if (typeof data?.detail === "string") {
          setError(data.detail);
        } else if (typeof data === "object") {
          const firstError = Object.values(data).flat()[0];

          setError(
            typeof firstError === "string"
              ? firstError
              : "Please check your information and try again.",
          );
        } else {
          setError("Please check your information and try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <GuestGuard>
      <AuthCard
        title="Create your account"
        description="Get started by creating your account."
        footer={
          <>
            Already have an account?{" "}
            <Link
              href="/accounts/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign in
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
            placeholder="Choose a username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <FormField
            id="email"
            name="email"
            label="Email address"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <FormField
            id="password"
            name="password"
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <FormField
            id="password-confirm"
            name="password_confirm"
            label="Confirm password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
          />

          <Button type="submit">Create account</Button>
        </form>
      </AuthCard>
    </GuestGuard>
  );
}
