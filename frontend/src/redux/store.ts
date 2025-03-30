import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { authApi } from "@/api/authApi";
import chatSlice from "./slices/chatSlice";
import { BaseApi } from "@/utils/baseFetch";

export const store = configureStore({
  reducer: {
    authSlice,
    chatSlice,
    [BaseApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(BaseApi.middleware);
  },
  devTools: process.env.REACT_APP_ENV !== "dev" ? false : true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
