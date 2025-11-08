import { createAsyncThunk } from "@reduxjs/toolkit";

import { transactionsApi } from "@/api/transaction/transactionApi";

export const fetchBalance = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("transaction/balance", async (_, { rejectWithValue }) => {
  try {
    const response = await transactionsApi.getBalance();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal get balance");
  }
});

export const postTopup = createAsyncThunk<any, any, { rejectValue: string }>(
  "transaction/topup",
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await transactionsApi.postTopup({
        top_up_amount: amount,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Gagal post topup");
    }
  }
);

export const postTransaction = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("transaction/post", async (serviceCode: string, { rejectWithValue }) => {
  try {
    const response = await transactionsApi.postTransaction({
      service_code: serviceCode,
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal post transaction");
  }
});

export const fetchTransactionsHistory = createAsyncThunk<
  any,
  { offset: number; limit: number },
  { rejectValue: string }
>("transaction/history", async (params, { rejectWithValue }) => {
  try {
    const response = await transactionsApi.getTransactionHistory(params);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal fetch transaksi");
  }
});
