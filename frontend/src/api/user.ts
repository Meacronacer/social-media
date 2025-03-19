import { Iuser } from "@/@types/user";
import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export const userApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<Iuser, void>({
      query: () => ({
        url: "/api/users/get-me",
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: ["User"],
    }),
    getAllUsers: builder.query<Iuser[], string>({
      query: (search = "") => ({
        url: `/api/users/all-users?search=${encodeURIComponent(search)}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
    }),
    getUser: builder.query({
      query: (userId) => ({
        url: `/api/users/${userId}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: `/api/users/update-profile`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateProfileMutation,
} = userApi;
