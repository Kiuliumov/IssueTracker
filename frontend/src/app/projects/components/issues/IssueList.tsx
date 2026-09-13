"use client";

import { observer } from "mobx-react-lite";

import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import IssueCard from "./IssueCard";
import issueStore from "@/stores/issueStore";

type IssueListProps = {
  projectId: number;
  onCreate: () => void;
};

function IssueList({ projectId, onCreate }: IssueListProps) {
  if (issueStore.loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (issueStore.error) {
    return <ErrorMessage message={issueStore.error} />;
  }

  const projectIssues = issueStore.issues.filter(
    (issue) => issue.project === projectId,
  );

  if (projectIssues.length === 0) {
    return (
      <EmptyState
        title="No issues yet"
        description="Create an issue to start tracking work for this project."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Create issue
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {projectIssues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

export default observer(IssueList);
