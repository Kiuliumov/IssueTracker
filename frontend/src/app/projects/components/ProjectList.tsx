"use client";

import { observer } from "mobx-react-lite";

import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";

import ProjectCard from "./ProjectCard";

import projectStore from "@/stores/projectStore";
import type { Project } from "@/lib/projects";

type ProjectListProps = {
  onEdit: (project: Project) => void;
  onCreate: () => void;
};

function ProjectList({ onEdit, onCreate }: ProjectListProps) {
  if (projectStore.loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (projectStore.error) {
    return <ErrorMessage message={projectStore.error} />;
  }

  if (projectStore.projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to start organizing your development work."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Create project
          </button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projectStore.projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default observer(ProjectList);
