import { BaseApi } from "@/utils/baseFetch";
import { postsApi } from "./postsApi";
import { RootState } from "@/redux/store";
import { IComment } from "@/@types/comment";
import { IPost } from "@/@types/post";
import { toast } from "react-toastify";

export const commentApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<
      IComment,
      { postId: string; text: string; userId: string }
    >({
      query: (commentData) => ({
        url: "/api/comment/create",
        method: "POST",
        body: commentData,
      }),
      async onQueryStarted(
        commentData,
        { dispatch, queryFulfilled, getState },
      ) {
        try {
          // Ожидаем успешного выполнения запроса и получения созданного комментария с сервера
          const { data: createdComment } = await queryFulfilled;

          // Обновляем кэшированные данные постов, добавляя новый комментарий
          const queries = postsApi.util.selectInvalidatedBy(getState(), [
            { type: "Post", id: commentData.postId },
          ]);

          for (const { endpointName, originalArgs } of queries) {
            if (endpointName === "getPostsPaginated") {
              dispatch(
                postsApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    const post = draft.posts.find(
                      (p: IPost) => p._id === commentData.postId,
                    );
                    if (post) {
                      // Если комментариев ещё нет, инициализируем пустой массив
                      if (!post.comments) post.comments = [];
                      post.comments.push(createdComment);
                    }
                  },
                ),
              );
            }
          }
        } catch {
          toast.error("An error occurred while creating the comment.");
        }
      },
    }),

    editComment: builder.mutation({
      // Чтобы иметь доступ к postId, расширяем аргументы мутации
      query: ({ commentId, text }) => ({
        url: `/api/comment/${commentId}`,
        method: "PATCH",
        body: { text },
      }),
      async onQueryStarted(
        {
          commentId,
          text,
          postId,
        }: { commentId: string; text: string; postId: string },
        { dispatch, queryFulfilled, getState },
      ) {
        const patchResults = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  const post = draft.posts.find((p: IPost) => p._id === postId);
                  if (post && post.comments) {
                    const comment = post.comments.find(
                      (c: IComment) => c._id === commentId,
                    );
                    if (comment) {
                      comment.text = text;
                    }
                  }
                },
              ),
            );
            patchResults.push(patchResult);
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
          toast.error("An error occurred while editing the comment.");
        }
      },
    }),

    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/api/comment/${commentId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled, getState },
      ) {
        const patchResults = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  const post = draft.posts.find((p: IPost) => p._id === postId);
                  if (post && post.comments) {
                    post.comments = post.comments.filter(
                      (c: IComment) => c._id !== commentId,
                    );
                  }
                },
              ),
            );
            patchResults.push(patchResult);
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
          toast.error("An error occurred while deleting the comment");
        }
      },
    }),

    likeComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/api/comment/${commentId}/like`,
        method: "POST",
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled, getState },
      ) {
        const userId = (getState() as RootState).authSlice.user._id;
        const patchResults = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  const post = draft.posts.find((p: IPost) => p._id === postId);
                  if (post && post.comments) {
                    const comment = post.comments.find(
                      (c: IComment) => c._id === commentId,
                    );
                    if (comment && userId) {
                      const isLiked = comment.likes.includes(userId);
                      if (isLiked) {
                        comment.likes = comment.likes.filter(
                          (id: string) => id !== userId,
                        );
                      } else {
                        comment.likes.push(userId);
                      }
                    }
                  }
                },
              ),
            );
            patchResults.push(patchResult);
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
          toast.error("an error occurred while Like/Unlike comment.");
        }
      },
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useEditCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
