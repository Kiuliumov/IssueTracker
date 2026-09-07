import api from "@/lib/api";

export type Project = {
  id: number;
  name: string;
  description: string;
  owner: number;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = {
  name: string;
  description: string;
};

export async function getProjects() {
  const response = await api.get("/projects/");
  return response.data;
}

export async function getProject(id: number) {
  const response = await api.get(`/projects/${id}/`);
  return response.data;
}

export async function createProject(data: ProjectInput) {
  const response = await api.post("/projects/", data);
  return response.data;
}

export async function updateProject(id: number, data: ProjectInput) {
  const response = await api.patch(`/projects/${id}/`, data);
  return response.data;
}

export async function deleteProject(id: number) {
  await api.delete(`/projects/${id}/`);
}
