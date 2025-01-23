// api/auth.ts
import { IauthResponse } from "@/@types/auth";
import $api from "@/utils/axiosInstance";
import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";
import { createApi } from "@reduxjs/toolkit/query";
import { AxiosResponse } from "axios";

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
    getMe: builder.query({
      query: () => ({
        url: "/api/auth/get-me",
        method: "GET",
        headers: baseHeadersOptions,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/api/auth/all-users",
        method: "GET",
        headers: baseHeadersOptions,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetAllUsersQuery,
} = authApi;

// export const login = async (
//   email: string,
//   password: string,
// ): Promise<AxiosResponse<IauthResponse>> => {
//   const response = await $api.post("/auth/login", { email, password });
//   return response.data;
// };

// export const register = async (
//   email: string,
//   password: string,
// ): Promise<void> => {
//   const response = await $api.post("/auth/register", {
//     email,
//     password,
//   });
//   return response.data;
// };

// export const logout = async () => {
//   await $api.post("/auth/logout");
// };
