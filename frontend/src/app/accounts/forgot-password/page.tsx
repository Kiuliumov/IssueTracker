"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import FormField from "../components/FormField";
import GuestGuard from "@/components/GuestGuard";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await api.post("/accounts/forgot-password/", {
        email,
      });

      setSuccess(true);
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
              : "Please check your email address and try again.",
          );
        } else {
          setError("Please check your email address and try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <AuthCard
        title="Forgot your password?"
        description="Enter your email address and we'll send you a link to reset your password."
        footer={
          <>
            Remember your password?{" "}
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

          {success && (
            <div
              role="status"
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
            >
              If an account exists with that email address, you will receive a
              password reset link shortly.
            </div>
          )}

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

          <Button type="submit" loading={loading}>
            Send reset link
          </Button>
        </form>
      </AuthCard>
    </GuestGuard>
  );
}
