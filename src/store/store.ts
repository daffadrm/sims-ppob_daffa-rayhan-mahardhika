import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


import infoReducer from "@/features/information/infoSlice";
import profileReducer from "@/features/profile/profileSlice";
import transactionsReducer from "@/features/transaction/transactionSlice";

import alertReducer from "./alertStore";
import authReducer from "../features/auth/authSlice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    alert: alertReducer,
    info: infoReducer,
    profile: profileReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
