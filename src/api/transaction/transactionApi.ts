import { privateApiService } from "../apiService";

export const transactionsApi = {
  getBalance: () => privateApiService.get("/balance"),
  postTopup: (data: { top_up_amount: number }) =>
    privateApiService.post("topup", data),
  postTransaction: (data: { service_code: string }) =>
    privateApiService.post("transaction", data),
  getTransactionHistory: (data: { offset: number; limit: number }) =>
    privateApiService.get(
      `transaction/history?limit=${data.limit}&offset=${data.offset}`
    ),
};
