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
      serializeQueryArgs: ({ queryArgs }) => queryArgs.userId,
      merge: (currentCache, newItems) => {
        const existingIds = new Set(currentCache.posts.map((p) => p._id));
        const filteredPosts = newItems.posts.filter(
          (post) => !existingIds.has(post._id),
        );

        return {
          posts: [...currentCache.posts, ...filteredPosts],
          hasMore: newItems.hasMore,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.lastCreatedAt !== previousArg?.lastCreatedAt;
      },
      providesTags: (result) => [
        { type: "Post", id: "LIST" },
        ...(result?.posts.map(({ _id }) => ({
          type: "Post" as const,
          id: _id,
        })) || []),
      ],
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: "/api/posts/create",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify(post),
      }),
      async onQueryStarted(newPost, { dispatch, queryFulfilled, getState }) {
        // Получаем данные текущего пользователя
        //@ts-ignore
        const currentUser = getState().authSlice.user;
        // Генерируем временный _id
        const tempId = "temp_" + Math.random().toString(36).substr(2, 9);
        const patchResults = [];
        // Получаем все кэшированные запросы, зависящие от тега "LIST"
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: "LIST" },
        ]);
        // Добавляем оптимистичное обновление в кэш для всех запросов getPostsPaginated
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  // Добавляем новый пост с временным _id и данными автора
                  draft.posts.unshift({
                    ...newPost,
                    _id: tempId,
                    createdAt: new Date().toISOString(),
                    likes: [],
                    comments: [],
                    author: {
                      _id: currentUser._id,
                      first_name: currentUser.first_name,
                      second_name: currentUser.second_name,
                      img_url: currentUser.img_url,
                    },
                  });
                },
              ),
            );
            patchResults.push(patchResult);
          }
        }
        try {
          // Ожидаем ответа от сервера с созданным постом
          const { data: createdPost } = await queryFulfilled;
          // Обновляем кэш, заменяя временный пост на созданный с реальным _id
          for (const { endpointName, originalArgs } of queries) {
            if (endpointName === "getPostsPaginated") {
              dispatch(
                postsApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    const index = draft.posts.findIndex(
                      (p) => p._id === tempId,
                    );
                    if (index !== -1) {
                      draft.posts[index] = createdPost;
                    }
                  },
                ),
              );
            }
          }
        } catch (error) {
          // При ошибке откатываем изменения
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: [{ type: "Post", id: "LIST" }, "User"],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/api/posts/${postId}`,
        method: "DELETE",
        headers: baseHeadersOptions,
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        // Собираем все запросы, зависящие от тега "LIST"
        const patchResults = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: "LIST" },
        ]);

        // Для каждого запроса, например getPostsPaginated, удаляем пост из списка
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  draft.posts = draft.posts.filter(
                    (post) => post._id !== postId,
                  );
                },
              ),
            );
            patchResults.push(patchResult);
          }
        }
        try {
          await queryFulfilled;
        } catch (error) {
          // Если сервер вернул ошибку, откатываем изменения
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
        "User",
      ],
    }),

    editPost: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/api/posts/${postId}`,
        method: "PATCH",
        headers: baseHeadersOptions,
        body: JSON.stringify({ text }),
      }),
      async onQueryStarted(
        { postId, text },
        { dispatch, queryFulfilled, getState },
      ) {
        const patchResults = [];
        // Получаем все кэшированные запросы, зависящие от тега "LIST"
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: "LIST" },
        ]);
        // Для каждого запроса (например, getPostsPaginated) обновляем текст поста
        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patchResult = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  const post = draft.posts.find((p) => p._id === postId);
                  if (post) {
                    post.text = text;
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
          // В случае ошибки откатываем все изменения
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),

    likePost: builder.mutation<IPost, string>({
      query: (postId) => ({
        url: `/api/posts/${postId}/like`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        //@ts-ignore
        const userId = getState().authSlice.user._id;

        // Оптимистичное обновление для всех постов
        const patches = [];
        const queries = postsApi.util.selectInvalidatedBy(getState(), [
          { type: "Post", id: "LIST" },
        ]);

        for (const { endpointName, originalArgs } of queries) {
          if (endpointName === "getPostsPaginated") {
            const patch = dispatch(
              postsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  const post = draft.posts.find((p) => p._id === postId);
                  if (post) {
                    post.likes = post.likes.includes(userId)
                      ? post.likes.filter((id: string) => id !== userId)
                      : [...post.likes, userId];
                  }
                },
              ),
            );
            patches.push(patch);
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
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
