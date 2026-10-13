import { api } from "../api";
import { endpoints } from "../endpoints";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginRequest = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(endpoints.login, data);
  return response.data;
};
