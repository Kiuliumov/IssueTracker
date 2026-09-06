"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import FormField from "../components/FormField";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      username,
      password,
    });
  };

  return (
    <AuthCard
      title="Sign in to your account"
      description="Welcome back. Enter your credentials to continue."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            href="/accounts/register"
            className="font-semibold text-indigo-300 hover:text-indigo-300"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              href="/forgot-password"
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
  );
}
