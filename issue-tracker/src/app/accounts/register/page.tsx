"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import FormField from "../components/FormField";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      return;
    }

    console.log({
      username,
      email,
      password,
      password_confirm: passwordConfirm,
    });
  };

  return (
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
  );
}
