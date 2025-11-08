import { privateApiService, publicApiService } from "../apiService";

export const informationApi = {
  getBanner: () => publicApiService.get("/banner"),
  getServices: () => privateApiService.get("/services"),
};
