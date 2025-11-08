import { publicApiService } from "../apiService";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    publicApiService.post("/login", data),

  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => publicApiService.post("/registration", data),
};
