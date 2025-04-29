import { IPost } from "@/@types/post";
import { RootState } from "@/redux/store";
import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";
import { userApi } from "./userApi";
import { toast } from "react-toastify";

type IcreatePost = { text: string; profileId: string };

export const postsApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostsPaginated: builder.query<
      { posts: IPost[]; hasMore: boolean },
      { userId: string; limit: number; lastCreatedAt?: Date }
    >({
      query: ({ userId, limit, lastCreatedAt }) => ({
        url: `/api/posts/all-posts/${userId}?limit=${limit}${
          lastCreatedAt ? `&lastCreatedAt=${lastCreatedAt}` : ""
        }`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.userId,
      merge: (currentCache, newData) => {
        const existingIds = new Set(currentCache.posts.map((p) => p._id));
        const newPosts = newData.posts.filter((p) => !existingIds.has(p._id));
        return {
          posts: [...currentCache.posts, ...newPosts],
          hasMore: newData.hasMore,
        };
      },
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
    createPost: builder.mutation<IPost, IcreatePost>({
      query: ({ text }) => ({
        url: "/api/posts/create",
        method: "POST",
        headers: baseHeadersOptions,
        body: JSON.stringify({ text }),
      }),
      async onQueryStarted(
        { profileId }: { text: string; profileId: string },
        { dispatch, queryFulfilled },
      ) {
        const limit = 10; // должен совпадать с лимитом, используемым в getPostsPaginated
        try {
          // Ожидаем ответа от сервера, который вернёт отредактированный пост
          const { data: newPost } = await queryFulfilled;
          // Обновляем кэш, вставляя новый пост в начало списка
          dispatch(
            postsApi.util.updateQueryData(
              "getPostsPaginated",
              { userId: profileId, limit },
              (draft) => {
                draft.posts.unshift(newPost);
              },
            ),
          );
          dispatch(
            userApi.util.updateQueryData("getMe", undefined, (draft) => {
              draft.postsCount = (draft.postsCount || 0) + 1;
            }),
          );
        } catch {
          // Обработка ошибки (если необходимо)
          toast.error("An error occurred while creating the post.");
        }
      },
    }),
    deletePost: builder.mutation<
      { message: string },
      { postId: string; profileId: string }
    >({
      query: ({ postId }) => ({
        url: `/api/posts/${postId}`,
        method: "DELETE",
        headers: baseHeadersOptions,
      }),
      async onQueryStarted(
        { postId, profileId },
        { dispatch, queryFulfilled },
      ) {
        const limit = 10; // должен совпадать с лимитом, который используется в getPostsPaginated
        // Оптимистично удаляем пост из списка
        const patchResult = dispatch(
          postsApi.util.updateQueryData(
            "getPostsPaginated",
            { userId: profileId, limit },
            (draft) => {
              draft.posts = draft.posts.filter((p) => p._id !== postId);
            },
          ),
        );
        // Оптимистично уменьшаем postCount в getMe
        const patchUser = dispatch(
          userApi.util.updateQueryData("getMe", undefined, (draft) => {
            draft.postsCount = Math.max((draft.postsCount || 1) - 1, 0);
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          patchUser.undo();
          toast.error("An error occurred while deleting the post.");
        }
      },
    }),

    editPost: builder.mutation<
      IPost,
      { postId: string; text: string; profileId: string }
    >({
      query: ({ postId, text }) => ({
        url: `/api/posts/${postId}`,
        method: "PATCH",
        headers: baseHeadersOptions,
        body: JSON.stringify({ postId, text }),
      }),
      async onQueryStarted(
        { postId, profileId },
        { dispatch, queryFulfilled },
      ) {
        const limit = 10;

        try {
          const { data: editedPost } = await queryFulfilled;
          // Обновляем кэш, вставляя новый пост в начало списка
          dispatch(
            postsApi.util.updateQueryData(
              "getPostsPaginated",
              { userId: profileId, limit },
              (draft) => {
                draft.posts.forEach((post) => {
                  if (post._id === postId) {
                    post.text = editedPost.text;
                    return;
                  }
                });
              },
            ),
          );
        } catch {
          toast.error("An error occurred while editing the post.");
        }
      },
    }),

    likePost: builder.mutation<IPost, { postId: string; profileId: string }>({
      query: ({ postId }) => ({
        url: `/api/posts/${postId}/like`,
        method: "POST",
        headers: baseHeadersOptions,
      }),
      async onQueryStarted(
        { postId, profileId },
        { dispatch, queryFulfilled, getState },
      ) {
        // Используем profileId, по которому кеширован запрос
        const limit = 10; // должен совпадать с запросом
        const state = getState() as RootState;
        const patchResult = dispatch(
          postsApi.util.updateQueryData(
            "getPostsPaginated",
            { userId: profileId, limit },
            (draft) => {
              const post = draft.posts.find((p) => p._id === postId);
              if (post) {
                // Если лайк уже поставлен – удаляем userId залогиненного пользователя,
                // иначе – добавляем.
                const loggedInUserId = state.authSlice.user?._id;
                if (post.likes.includes(loggedInUserId)) {
                  post.likes = post.likes.filter(
                    (id: string) => id !== loggedInUserId,
                  );
                } else {
                  post.likes.push(loggedInUserId);
                }
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          toast.error("An error occurred while liking/unliking the post.");
        }
      },
    }),
  }),
});

export const {
  useGetPostsPaginatedQuery,
  useLazyGetPostsPaginatedQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  useLikePostMutation,
} = postsApi;
