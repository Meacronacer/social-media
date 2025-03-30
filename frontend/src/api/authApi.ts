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
    forgotPassword: builder.mutation({
      query: (email: string) => ({
        url: "/api/auth/request-password-reset",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({ email }),
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(data),
      }),
    }),
    checkTokenValidity: builder.query({
      query: (token) => ({
        url: `/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`,
        method: "GET",
        headers: baseHeadersOptions,
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

export const {
  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCheckTokenValidityQuery,
} = authApi;
