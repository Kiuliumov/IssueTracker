import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let csrfToken: string | null = null;

export async function getCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await api.get("/accounts/csrf/");
  csrfToken = response.data.csrfToken;

  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();

  if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const token = await getCsrfToken();

    config.headers.set("X-CSRFToken", token);
  }

  return config;
});

export default api;
