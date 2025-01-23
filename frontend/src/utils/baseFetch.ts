import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseFetchInstance";

export const BaseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export const baseHeadersOptions = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
