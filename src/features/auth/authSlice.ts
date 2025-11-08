import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { loginThunk, registerThunk } from "./authThunk";

interface AuthState {
  user: null | { username: string };
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (
          state,
          action: PayloadAction<{ user: any; data: { token: string } }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.data.token;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Login gagal";
      });

    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Login gagal";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
