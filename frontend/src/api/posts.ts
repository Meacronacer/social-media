import { IPost } from "@/@types/post";
import { RootState } from "@/redux/store";
import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export const postsApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostsPaginated: builder.query<
      { posts: IPost[]; hasMore: boolean },
      { userId: string; limit: number; lastCreatedAt?: string }
    >({
      query: ({ userId, limit, lastCreatedAt }) => ({
        url: `/api/posts/all-posts/${userId}?limit=${limit}${lastCreatedAt ? `&lastCreatedAt=${lastCreatedAt}` : ""}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      merge: (currentCache, newItems) => ({
        posts: [...currentCache.posts, ...newItems.posts],
        hasMore: newItems.hasMore,
      }),
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.lastCreatedAt !== previousArg?.lastCreatedAt;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({
                type: "Post" as const,
                id: _id,
              })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: "/api/posts/create",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(post),
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/api/posts/${postId}`,
        method: "DELETE",
        headers: baseHeadersOptions,
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
    }),
    editPost: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/api/posts/${postId}`,
        method: "PATCH",
        headers: baseHeadersOptions,
        body: JSON.stringify({ text }),
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/api/posts/${postId}/like`,
        method: "POST",
        headers: baseHeadersOptions,
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const {
  useGetPostsPaginatedQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  useLikePostMutation,
} = postsApi;
