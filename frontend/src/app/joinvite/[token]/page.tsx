"use client";

import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import Container from "@/components/layout/Container";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Card from "@/components/ui/Card";
import { acceptJoinvite } from "@/lib/joinvite";

function JoinvitePage() {
  const params = useParams();
  const router = useRouter();

  const token = String(params.token);

  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await acceptJoinvite(token);

      setAccepted(true);

      setTimeout(() => {
        router.push(`/projects/${data.project}`);
      }, 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail || "Failed to accept this invitation.";

        setError(message);
      } else {
        setError("Failed to accept this invitation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <div className="mx-auto max-w-lg py-20">
            <Card className="p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">
                  Project invitation
                </h1>

                {!accepted && !error && (
                  <>
                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      You have been invited to join a project.
                    </p>

                    <button
                      type="button"
                      onClick={handleAccept}
                      disabled={loading}
                      className="mt-8 rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? "Joining project..." : "Accept invitation"}
                    </button>
                  </>
                )}

                {accepted && (
                  <>
                    <p className="mt-4 text-sm text-green-400">
                      Invitation accepted successfully.
                    </p>

                    <div className="mt-6 flex justify-center">
                      <LoadingSpinner />
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      Redirecting to the project...
                    </p>
                  </>
                )}

                {error && (
                  <div className="mt-6">
                    <ErrorMessage message={error} />

                    <Link
                      href="/projects"
                      className="mt-6 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
                    >
                      Back to projects
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </ProtectedRoute>
  );
}

export default JoinvitePage;
