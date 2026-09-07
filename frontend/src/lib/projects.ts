import api from "@/lib/api";

export type ProjectUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  owner: ProjectUser;
  members: ProjectUser[];
  created_at: string;
  updated_at: string;
};

export type ProjectInput = {
  name: string;
  description: string;
};

export type ProjectListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
};

export async function getProjects(page = 1) {
  const response = await api.get("/projects/", {
    params: { page },
  });

  return response.data as ProjectListResponse;
}

export async function getProject(id: number) {
  const response = await api.get(`/projects/${id}/`);
  return response.data as Project;
}

export async function createProject(data: ProjectInput) {
  const response = await api.post("/projects/", data);
  return response.data as Project;
}

export async function updateProject(id: number, data: ProjectInput) {
  const response = await api.patch(`/projects/${id}/`, data);
  return response.data as Project;
}

export async function deleteProject(id: number) {
  await api.delete(`/projects/${id}/`);
}
