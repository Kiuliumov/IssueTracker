"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import Container from "@/components/layout/Container";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";
import IssueCard from "../components/issues/IssueCard";
import IssuePagination from "../components/issues/IssuePagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import issueStore from "@/stores/issueStore";

function IssuesPage() {
  useEffect(() => {
    issueStore.fetchIssues();
  }, []);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Issues
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              View and manage issues across your projects.
            </p>
          </div>

          {issueStore.loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {!issueStore.loading && issueStore.error && (
            <ErrorMessage message={issueStore.error} />
          )}

          {!issueStore.loading &&
            !issueStore.error &&
            issueStore.issues.length === 0 && (
              <EmptyState
                title="No issues yet"
                description="Create an issue from a project to start tracking your development work."
              />
            )}

          {!issueStore.loading &&
            !issueStore.error &&
            issueStore.issues.length > 0 && (
              <>
                <div className="grid gap-4">
                  {issueStore.issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>

                <IssuePagination />
              </>
            )}
        </Container>
      </main>
    </ProtectedRoute>
  );
}

export default observer(IssuesPage);
