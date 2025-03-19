import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { authApi } from "@/api/auth";
import chatSlice from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    authSlice,
    chatSlice,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(authApi.middleware);
  },
  devTools: process.env.REACT_APP_ENV !== "dev" ? false : true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
