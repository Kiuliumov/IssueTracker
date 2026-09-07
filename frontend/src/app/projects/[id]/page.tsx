"use client";

import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Container from "@/components/layout/Container";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import Card from "@/components/ui/Card";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";
import { getProject, type Project } from "@/lib/projects";
import projectStore from "@/stores/projectStore";

function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = Number(params.id);

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProject(projectId);
        setProject(data);
      } catch {
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleDelete = async () => {
    if (!project) return;

    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await projectStore.remove(project.id);
      router.push("/projects");
    } catch {
      setError("Failed to delete project.");
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <div className="mb-6">
            <Link
              href="/projects"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to projects
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {!loading && error && <ErrorMessage message={error} />}

          {!loading && project && (
            <>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    {project.name}
                  </h1>

                  <p className="mt-2 max-w-2xl text-gray-400">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/projects/${project.id}/edit`}
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
                      Issues
                    </h2>

                    <div className="mt-6 rounded-lg border border-dashed border-gray-800 px-6 py-10 text-center">
                      <p className="text-sm text-gray-400">
                        Issues will appear here.
                      </p>
                    </div>
                  </Card>
                </div>

                <div>
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-white">
                      Members
                    </h2>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">
                            User #{project.owner}
                          </p>
                          <p className="text-xs text-gray-400">
                            Owner
                          </p>
                        </div>
                      </div>

                      {project.members.map((memberId) => (
                        <div
                          key={memberId}
                          className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3"
                        >
                          <p className="text-sm font-medium text-white">
                            User #{memberId}
                          </p>

                          <span className="text-xs text-gray-400">
                            Member
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                      Add member
                    </button>
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

export default observer(ProjectDetailPage);