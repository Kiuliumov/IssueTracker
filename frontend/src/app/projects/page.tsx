"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Container from "@/components/layout/Container";
import PageHeader from "@/components/layout/PageHeader";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";

import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";

import projectStore from "@/stores/projectStore";
import type { Project } from "@/lib/projects";

function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | undefined>();

  useEffect(() => {
    projectStore.fetchProjects();
  }, []);

  const handleCreate = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <PageHeader
            title="Projects"
            description="Manage your projects and keep your development work organized."
            action={
              !showForm ? (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  New project
                </button>
              ) : undefined
            }
          />

          {showForm ? (
            <div className="mx-auto max-w-2xl">
              <ProjectForm
                project={editingProject}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          ) : (
            <ProjectList
              onCreate={handleCreate}
              onEdit={handleEdit}
            />
          )}
        </Container>
      </main>
    </ProtectedRoute>
  );
}

export default observer(ProjectsPage);