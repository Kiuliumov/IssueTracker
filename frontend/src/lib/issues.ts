import api from "@/lib/api";

export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";

export type IssuePriority = "low" | "medium" | "high" | "critical";

export type Issue = {
  id: number;
  project: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporter: number;
  assignee: number | null;
  created_at: string;
  updated_at: string;
};

export type IssueInput = {
  project: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: number | null;
};

export type IssueListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Issue[];
};

export async function getIssues(page = 1) {
  const response = await api.get("/issues/", {
    params: { page },
  });

  return response.data as IssueListResponse;
}

export async function getIssue(id: number) {
  const response = await api.get(`/issues/${id}/`);
  return response.data as Issue;
}

export async function createIssue(data: IssueInput) {
  const response = await api.post("/issues/", data);
  return response.data as Issue;
}

export async function updateIssue(id: number, data: IssueInput) {
  const response = await api.patch(`/issues/${id}/`, data);
  return response.data as Issue;
}

export async function deleteIssue(id: number) {
  await api.delete(`/issues/${id}/`);
}
