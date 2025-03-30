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
    // userApi.ts
    getAllUsers: builder.query<
      { users: Iuser[]; hasMore: boolean; currentPage: number },
      { search: string; page: number; limit: number }
    >({
      query: ({ search, page, limit }) => ({
        url: `/api/users/all-users`,
        params: { search, page, limit },
      }),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.search,
      merge: (currentCache, newItems) => {
        if (newItems?.currentPage === 1) return newItems;

        // Фильтрация дубликатов
        const newUsers = newItems.users.filter(
          (newUser) =>
            !currentCache.users.some((user) => user._id === newUser._id),
        );

        return {
          ...newItems,
          users: [...currentCache.users, ...newUsers],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.search !== previousArg?.search
        );
      },
    }),
    getUser: builder.query<Iuser, string>({
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
  useLazyGetAllUsersQuery,
  useUpdateProfileMutation,
} = userApi;
