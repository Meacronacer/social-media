import { IAuthor } from "@/@types/user";
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
      providesTags: ["SubscriptionsList"],
    }),
    subscribe: builder.mutation<string, string>({
      query: (targetUserId) => ({
        url: `api/subscriptions/subscribe`,
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({ targetUserId }),
      }),
      invalidatesTags: ["User", "SubscriptionsList"],
    }),
    unSubscribe: builder.mutation<{ message: string }, string>({
      query: (targetUserId) => ({
        url: `api/subscriptions/unsubscribe`,
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({ targetUserId }),
      }),
      invalidatesTags: ["User", "SubscriptionsList"],
    }),
    getFollowers: builder.query<IAuthor[], string | undefined>({
      query: (targetUserId) => ({
        url: `api/subscriptions/${targetUserId}/followers`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: (result, error, targetUserId) => [
        { type: "SubscriptionsList", id: targetUserId },
        "SubscriptionsList",
      ],
    }),
    getFollowing: builder.query<IAuthor[], string | undefined>({
      query: (targetUserId) => ({
        url: `api/subscriptions/${targetUserId}/following`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: (result, error, targetUserId) => [
        { type: "SubscriptionsList", id: targetUserId },
        "SubscriptionsList",
      ],
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
