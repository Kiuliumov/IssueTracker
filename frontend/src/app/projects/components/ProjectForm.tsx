"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ErrorMessage from "@/components/ui/ErrorMessage";

import projectStore from "@/stores/projectStore";
import type { Project, ProjectInput } from "@/lib/projects";

type ProjectFormProps = {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(
    project?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(project);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    const data: ProjectInput = {
      name: name.trim(),
      description: description.trim(),
    };

    setSaving(true);

    try {
      if (project) {
        await projectStore.update(project.id, data);
      } else {
        await projectStore.create(data);
      }

      onSuccess?.();
    } catch {
      setError(
        isEditing
          ? "Failed to update project."
          : "Failed to create project.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          {isEditing ? "Edit project" : "Create project"}
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          {isEditing
            ? "Update your project details."
            : "Create a project to organize your issues."}
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
            htmlFor="project-name"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Name
          </label>

          <Input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. IssueTracker"
            disabled={saving}
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Description
          </label>

          <Textarea
            id="project-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe what this project is about..."
            rows={5}
            disabled={saving}
          />
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
            {saving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create project"}
          </button>
        </div>
      </form>
    </Card>
  );
}