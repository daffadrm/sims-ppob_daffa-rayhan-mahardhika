import { createAsyncThunk } from "@reduxjs/toolkit";

import { informationApi } from "@/api/information/infomationApi";

export const infoBannerThunk = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("banner", async (_, { rejectWithValue }) => {
  try {
    const response = await informationApi.getBanner();
    return response.data;
  } catch (err: any) {
    console.log(err);
    return rejectWithValue(err.message || "Gagal login");
  }
});

export const infoServicesThunk = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("services", async (_, { rejectWithValue }) => {
  try {
    const response = await informationApi.getServices();
    return response.data;
  } catch (err: any) {
    console.log(err);
    return rejectWithValue(err.message || "Gagal login");
  }
});
