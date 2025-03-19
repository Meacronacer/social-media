import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseFetchInstance";

export const BaseApi = createApi({
  tagTypes: ["ChatMessages", "Post", "User", "Subscriptions"], // Здесь указываем tagTypes
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export const baseHeadersOptions = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
