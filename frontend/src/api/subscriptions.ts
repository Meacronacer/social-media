import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export const followersApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRelationshipStatus: builder.query<
      { isFollowing: boolean; isFollowedBy: boolean },
      string
    >({
      query: (targetUserId) => ({
        url: `api/subscriptions/relationship-status/${targetUserId}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: ["Subscriptions"],
    }),

    subscribe: builder.mutation({
      query: (targetUserId) => ({
        url: `api/subscriptions/subscribe`,
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({ targetUserId }),
      }),
      invalidatesTags: ["User", "Subscriptions"],
    }),

    unSubscribe: builder.mutation({
      query: (targetUserId) => ({
        url: `api/subscriptions/unsubscribe`,
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({ targetUserId }),
      }),
      invalidatesTags: ["User", "Subscriptions"],
    }),
    getFollowers: builder.query({
      query: (targetUserId) => ({
        url: `api/subscriptions/${targetUserId}/followers`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: ["Subscriptions"],
    }),
    getFollowing: builder.query({
      query: (targetUserId) => ({
        url: `api/subscriptions/${targetUserId}/following`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useGetRelationshipStatusQuery,
  useSubscribeMutation,
  useUnSubscribeMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = followersApi;
