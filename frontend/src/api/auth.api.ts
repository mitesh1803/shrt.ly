import api from "../utils/axios";

export interface AuthResponse {
  id: number;
  email: string;
  token: string;
}

export const registerUser = async (email: string, password: string) => {
  await api.post("/api/auth/register", { email, password });
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });

  return response.data;
};
