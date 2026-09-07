"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import issueStore from "@/stores/issueStore";
import type {
  Issue,
  IssueInput,
  IssuePriority,
  IssueStatus,
} from "@/lib/issues";

type IssueFormProps = {
  projectId: number;
  issue?: Issue;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function IssueForm({
  projectId,
  issue,
  onSuccess,
  onCancel,
}: IssueFormProps) {
  const [title, setTitle] = useState(issue?.title ?? "");
  const [description, setDescription] = useState(issue?.description ?? "");
  const [status, setStatus] = useState<IssueStatus>(issue?.status ?? "open");
  const [priority, setPriority] = useState<IssuePriority>(
    issue?.priority ?? "medium",
  );
  const [assignee, setAssignee] = useState(
    issue?.assignee ? String(issue.assignee) : "",
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(issue);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Issue title is required.");
      return;
    }

    const data: IssueInput = {
      project: projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee ? Number(assignee) : null,
    };

    setSaving(true);

    try {
      if (issue) {
        await issueStore.update(issue.id, data);
      } else {
        await issueStore.create(data);
      }

      onSuccess?.();
    } catch {
      setError(
        isEditing ? "Failed to update issue." : "Failed to create issue.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          {isEditing ? "Edit issue" : "Create issue"}
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          {isEditing
            ? "Update the issue details."
            : "Create an issue to track work for this project."}
        </p>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="issue-title"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Title
          </label>

          <Input
            id="issue-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Login button is not working"
            disabled={saving}
          />
        </div>

        <div>
          <label
            htmlFor="issue-description"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Description
          </label>

          <Textarea
            id="issue-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the problem..."
            rows={6}
            disabled={saving}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="issue-status"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Status
            </label>

            <Select
              id="issue-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as IssueStatus)}
              disabled={saving}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
          </div>

          <div>
            <label
              htmlFor="issue-priority"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Priority
            </label>

            <Select
              id="issue-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as IssuePriority)
              }
              disabled={saving}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
        </div>

        <div>
          <label
            htmlFor="issue-assignee"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Assignee
          </label>

          <Input
            id="issue-assignee"
            type="number"
            min="1"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="User ID (optional)"
            disabled={saving}
          />

          <p className="mt-1 text-xs text-gray-500">
            We will replace this with a project member selector later.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create issue"}
          </button>
        </div>
      </form>
    </Card>
  );
}
