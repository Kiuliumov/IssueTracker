"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { Issue } from "@/lib/issues";

type IssueCardProps = {
  issue: Issue;
};

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

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/issues/${issue.id}`}
            className="font-semibold text-white hover:text-indigo-400"
          >
            {issue.title}
          </Link>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
            {issue.description || "No description provided."}
          </p>
        </div>

        <span className="shrink-0 text-xs text-gray-500">#{issue.id}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant={getStatusVariant(issue.status)}>
          {statusLabels[issue.status]}
        </Badge>

        <Badge variant={getPriorityVariant(issue.priority)}>
          {priorityLabels[issue.priority]}
        </Badge>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Reporter</span>

          <Link
            href="/profile"
            className="text-sm font-medium text-gray-300 hover:text-indigo-400"
          >
            {issue.reporter.username}
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Assignee</span>

          {issue.assignee ? (
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-300 hover:text-indigo-400"
            >
              {issue.assignee.username}
            </Link>
          ) : (
            <span className="text-sm text-gray-500">Unassigned</span>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href={`/projects/issues/${issue.id}`}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            View issue →
          </Link>
        </div>
      </div>
    </Card>
  );
}
