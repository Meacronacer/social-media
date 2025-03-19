import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export const authApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/auth/sign-in",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: "/api/auth/sign-up",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
        headers: baseHeadersOptions,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation, useLogoutMutation } =
  authApi;
