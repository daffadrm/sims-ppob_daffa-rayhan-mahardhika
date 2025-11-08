import { createAsyncThunk } from "@reduxjs/toolkit";

import { profileApi } from "@/api/profile/profileApi";

type UpdateProfilePayload = {
  first_name: string;
  last_name: string;
};

export const fetchProfile = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>("profile", async (_, { rejectWithValue }) => {
  try {
    const response = await profileApi.getProfile();
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal get profile");
  }
});

export const postProfileImage = createAsyncThunk<
  any,
  File,
  { rejectValue: string }
>("profile/uploadImage", async (file, { rejectWithValue }) => {
  try {
    const response = await profileApi.postImageProfile(file);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal upload foto profil");
  }
});

export const postUpdateProfile = createAsyncThunk<
  any,
  UpdateProfilePayload,
  { rejectValue: string }
>("transaction", async (payload, { rejectWithValue }) => {
  try {
    const response = await profileApi.postUpdateProfile(payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Gagal post transaction");
  }
});
