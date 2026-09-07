"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import projectStore from "@/stores/projectStore";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
};

export default function ProjectCard({
  project,
  onEdit,
}: ProjectCardProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await projectStore.remove(project.id);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            href={`/projects/${project.id}`}
            className="text-lg font-semibold text-white hover:text-indigo-400"
          >
            {project.name}
          </Link>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-gray-800 pt-4">
        <Button
          href={`/projects/${project.id}`}
          variant="primary"
        >
          View
        </Button>

        <button
          type="button"
          onClick={() => onEdit(project)}
          className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 hover:text-white"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </Card>
  );
}