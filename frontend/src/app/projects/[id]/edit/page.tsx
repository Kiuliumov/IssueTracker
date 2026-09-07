"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/route-guards/ProtectedRoute";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ProjectForm from "../../components/ProjectForm";
import { getProject, type Project } from "@/lib/projects";

export default function EditProjectPage() {
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

  const handleSuccess = () => {
    router.push(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-950 text-white">
        <Container>
          <div className="mb-6">
            <Link
              href={`/projects/${projectId}`}
              className="text-sm text-gray-400 transition hover:text-white"
            >
              ← Back to project
            </Link>
          </div>

          <div className="mx-auto max-w-2xl">
            {loading && (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {!loading && error && <ErrorMessage message={error} />}

            {!loading && project && (
              <ProjectForm
                project={project}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}
          </div>
        </Container>
      </main>
    </ProtectedRoute>
  );
}
