import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { infoBannerThunk, infoServicesThunk } from "./infoThunk";

interface ServicesType {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
}
interface InfoState {
  banners: Array<{
    banner_name: string;
    banner_image: string;
    description: string;
  }>;
  services: ServicesType[];
  loading: boolean;
  error: string | null;
  selectedService: ServicesType;
}

const initialState: InfoState = {
  banners: [],
  services: [],
  loading: false,
  error: null,
  selectedService: null,
};

const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setSelectedService(state, action: PayloadAction<any>) {
      state.selectedService = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(infoBannerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(infoBannerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.data;
      })
      .addCase(infoBannerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Error";
      });

    builder
      .addCase(infoServicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(infoServicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.data;
      })
      .addCase(infoServicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Error";
      });
  },
});

export const { setSelectedService } = infoSlice.actions;

export default infoSlice.reducer;
