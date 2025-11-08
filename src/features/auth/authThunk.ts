import { createAsyncThunk } from "@reduxjs/toolkit";

import { authApi } from "@/api/auth/auth";

export const loginThunk = createAsyncThunk<any, any, { rejectValue: string }>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      return response.data;
    } catch (err: any) {
      console.error("err thunk:", err);
      return rejectWithValue(err.message || "Gagal login");
    }
  }
);

export const registerThunk = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>(
  "auth/register",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.message || "Gagal Registrasi");
    }
  }
);
