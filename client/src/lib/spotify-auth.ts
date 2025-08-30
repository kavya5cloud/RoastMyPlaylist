import { apiRequest } from "@/lib/queryClient";

export async function initiateSpotifyLogin(): Promise<string> {
  const response = await apiRequest("GET", "/api/auth/spotify");
  const data = await response.json();
  return data.authUrl;
}

export async function getCurrentUser() {
  const response = await apiRequest("GET", "/api/user");
  return response.json();
}

export async function logout() {
  await apiRequest("POST", "/api/logout");
}
