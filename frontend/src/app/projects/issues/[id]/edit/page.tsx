"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import IssueForm from "../../../../../app/projects/components/issues/IssueForm";
import issueStore from "@/stores/issueStore";
import type { Issue } from "@/lib/issues";

function IssueEditPage() {
  const params = useParams();
  const router = useRouter();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const issueId = Number(params.id);

  useEffect(() => {
    if (!issueId) return;

    const loadIssue = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await issueStore.fetchIssue(issueId);
        setIssue(data);
      } catch {
        setError("Failed to load issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [issueId]);

  const handleSuccess = () => {
    router.push(`/projects/issues/${issueId}`);
  };

  const handleCancel = () => {
    router.push(`/projects/issues/${issueId}`);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <div className="mb-6">
            <Link
              href={`/issues/${issueId}`}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to issue
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {!loading && error && <ErrorMessage message={error} />}

          {!loading && issue && (
            <div className="mx-auto max-w-2xl">
              <IssueForm
                projectId={issue.project}
                issue={issue}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          )}
        </Container>
      </main>
    </ProtectedRoute>
  );
}

export default observer(IssueEditPage);
