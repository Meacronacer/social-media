import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export const commentApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (commentData) => ({
        url: "/api/comment/create",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
    editComment: builder.mutation({
      query: ({ commentId, text }) => ({
        url: `/api/comment/${commentId}`,
        method: "PATCH",
        body: { text },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    deleteComment: builder.mutation({
      query: ({ commentId, postId }) => ({
        url: `/api/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    likeComment: builder.mutation({
      query: (commentId) => ({
        url: `/api/comment/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useEditCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
