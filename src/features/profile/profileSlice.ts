import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProfile,
  postProfileImage,
  postUpdateProfile,
} from "./profileThunk";

interface ProfileType {
  profiles: {
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
  };
  loading: boolean;
  error: string | null;

  loadingUpdate: boolean;
}

const initialState: ProfileType = {
  profiles: {
    email: "",
    first_name: "",
    last_name: "",
    profile_image: "",
  },
  loading: false,
  error: null,

  loadingUpdate: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Error";
      });

    builder
      .addCase(postProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data;
      })
      .addCase(postProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Error";
      });
    builder
      .addCase(postUpdateProfile.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
      })
      .addCase(postUpdateProfile.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.profiles = action.payload.data;
      })
      .addCase(postUpdateProfile.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload || action.error.message || "Error";
      });
  },
});
export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;
