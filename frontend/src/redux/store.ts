import { configureStore } from "@reduxjs/toolkit";
//import { authApi } from "@/api/authApi";
import chatSlice from "./slices/chatSlice";
import { BaseApi } from "@/utils/baseFetch";

export const store = configureStore({
  reducer: {
    chatSlice,
    [BaseApi.reducerPath]: BaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(BaseApi.middleware);
  },
  devTools: process.env.REACT_APP_ENV !== "dev" ? false : true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
