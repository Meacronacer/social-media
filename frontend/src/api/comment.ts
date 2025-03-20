import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";
import { postsApi } from "./posts";
import { RootState } from "@/redux/store";

export const commentApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (commentData) => ({
        url: "/api/comment/create",
        method: "POST",
        body: commentData,
      }),
      async onQueryStarted(
        commentData,
        { dispatch, queryFulfilled, getState },
      ) {
        // Генерируем временный _id для комментария
        const tempId = "temp_" + Math.random().toString(36).substr(2, 9);
        const patchResults: any[] = [];
        // Находим все кэшированные запросы, где есть пост с commentData.postId
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: commentData.postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft: any) => {
                  const post = draft.posts.find(
                    (p: any) => p._id === commentData.postId,
                  );
                  if (post) {
                    // Если комментариев ещё нет, инициализируем пустой массив
                    if (!post.comments) post.comments = [];
                    post.comments.push({
                      ...commentData,
                      _id: tempId,
                      likes: [],
                      createdAt: new Date().toISOString(),
                    });
                  }
                },
              ),
            );
            patchResults.push(patchResult);
          }
        }
        try {
          // Получаем созданный комментарий с сервера
          const { data: createdComment } = await queryFulfilled;
          // Заменяем временный комментарий на полученный с сервера
          for (const { endpointName, originalArgs } of queries) {
            if (endpointName === "getPostsPaginated") {
              dispatch(
                postsApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft: any) => {
                    const post = draft.posts.find(
                      (p: any) => p._id === commentData.postId,
                    );
                    if (post) {
                      const index = post.comments.findIndex(
                        (c: any) => c._id === tempId,
                      );
                      if (index !== -1) {
                        post.comments[index] = createdComment;
                      }
                    }
                  },
                ),
              );
            }
          }
        } catch (error) {
          // Откат изменений в случае ошибки
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
      ],
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
        const patchResults: any[] = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft: any) => {
                  const post = draft.posts.find((p: any) => p._id === postId);
                  if (post && post.comments) {
                    const comment = post.comments.find(
                      (c: any) => c._id === commentId,
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
        } catch (error) {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    deleteComment: builder.mutation({
      query: ({ commentId, postId }) => ({
        url: `/api/comment/${commentId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled, getState },
      ) {
        const patchResults: any[] = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft: any) => {
                  const post = draft.posts.find((p: any) => p._id === postId);
                  if (post && post.comments) {
                    post.comments = post.comments.filter(
                      (c: any) => c._id !== commentId,
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
        } catch (error) {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    likeComment: builder.mutation({
      query: ({ commentId, postId }) => ({
        url: `/api/comment/${commentId}/like`,
        method: "POST",
      }),
      async onQueryStarted(
        { commentId, postId },
        { dispatch, queryFulfilled, getState },
      ) {
        //@ts-ignore
        const userId = (getState() as RootState).authSlice.user._id;
        const patchResults: any[] = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: postId },
        ]);
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft: any) => {
                  const post = draft.posts.find((p: any) => p._id === postId);
                  if (post && post.comments) {
                    const comment = post.comments.find(
                      (c: any) => c._id === commentId,
                    );
                    if (comment) {
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
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
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
