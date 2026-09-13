import api from "@/lib/api";

export type Joinvite = {
  id: number;
  project: number;
  email: string;
  invited_by: number;
  status: "pending" | "accepted" | "expired" | "revoked";
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export async function createJoinvite(projectId: number, email: string) {
  const response = await api.post(`/projects/${projectId}/joinvite/`, {
    email,
  });

  return response.data as Joinvite;
}

export async function acceptJoinvite(token: string) {
  const response = await api.post(`/joinvite/${token}/accept/`);

  return response.data as {
    detail: string;
    project: number;
  };
}

export async function revokeJoinvite(joinviteId: number) {
  await api.delete(`/joinvite/${joinviteId}/`);
}
