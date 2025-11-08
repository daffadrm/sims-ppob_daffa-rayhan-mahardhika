import { privateApiService } from "../apiService";

export const profileApi = {
  getProfile: () => privateApiService.get("/profile"),
  postImageProfile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return privateApiService.put("/profile/image", formData);
  },
  postUpdateProfile: (data: { first_name: string; last_name: string }) =>
    privateApiService.put("/profile/update", data),
};
