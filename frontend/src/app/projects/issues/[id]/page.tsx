"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ErrorMessage from "@/components/ui/ErrorMessage";
import issueStore from "@/stores/issueStore";
import type { Issue } from "@/lib/issues";

const statusLabels: Record<Issue["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityLabels: Record<Issue["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

function getStatusVariant(
  status: Issue["status"],
): "default" | "success" | "warning" | "danger" {
  if (status === "resolved" || status === "closed") {
    return "success";
  }

  if (status === "in_progress") {
    return "warning";
  }

  return "default";
}

function getPriorityVariant(
  priority: Issue["priority"],
): "default" | "success" | "warning" | "danger" {
  if (priority === "critical") {
    return "danger";
  }

  if (priority === "high") {
    return "warning";
  }

  if (priority === "low") {
    return "success";
  }

  return "default";
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function IssueDetailPage() {
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

  const handleDelete = async () => {
    if (!issue) return;

    const confirmed = window.confirm(
      `Delete "${issue.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await issueStore.remove(issue.id);
      router.push(`/projects/${issue.project}`);
    } catch {
      setError("Failed to delete issue.");
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <div className="mb-6">
            <Link
              href={issue ? `/projects/${issue.project}` : "/projects"}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to project
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {!loading && error && <ErrorMessage message={error} />}

          {!loading && issue && (
            <>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant={getStatusVariant(issue.status)}>
                      {statusLabels[issue.status]}
                    </Badge>

                    <Badge variant={getPriorityVariant(issue.priority)}>
                      {priorityLabels[issue.priority]}
                    </Badge>

                    <span className="text-sm text-gray-500">#{issue.id}</span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    {issue.title}
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    Created {formatDate(issue.created_at)}
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <Link
                    href={`/issues/${issue.id}/edit`}
                    className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-white">
                      Description
                    </h2>

                    <div className="mt-5">
                      {issue.description ? (
                        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                          {issue.description}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No description provided.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>

                <div>
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-white">
                      Details
                    </h2>

                    <dl className="mt-5 space-y-5">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Status
                        </dt>

                        <dd className="mt-2">
                          <Badge variant={getStatusVariant(issue.status)}>
                            {statusLabels[issue.status]}
                          </Badge>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Priority
                        </dt>

                        <dd className="mt-2">
                          <Badge variant={getPriorityVariant(issue.priority)}>
                            {priorityLabels[issue.priority]}
                          </Badge>
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Reporter
                        </dt>

                        <dd className="mt-1 text-sm text-gray-300">
                          User #{issue.reporter}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Assignee
                        </dt>

                        <dd className="mt-1 text-sm text-gray-300">
                          {issue.assignee
                            ? `User #${issue.assignee}`
                            : "Unassigned"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Last updated
                        </dt>

                        <dd className="mt-1 text-sm text-gray-300">
                          {formatDate(issue.updated_at)}
                        </dd>
                      </div>
                    </dl>
                  </Card>
                </div>
              </div>
            </>
          )}
        </Container>
      </main>
    </ProtectedRoute>
  );
}

export default observer(IssueDetailPage);
