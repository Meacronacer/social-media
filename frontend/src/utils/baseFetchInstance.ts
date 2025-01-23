import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { LinkTo } from "./links";
//import { baseQueryWithReauth } from "./baseFetch";

// initialize an empty api service that we'll inject endpoints into later as needed

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  credentials: "include",
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions); // Выполняем запрос

  // Если получили 401 (Unauthorized), пытаемся обновить токен
  if (result.error && result.error.status === 401) {
    // Обновляем токен
    const refreshResult = await baseQuery(
      {
        url: "/api/auth/refresh", // Эндпоинт для обновления токена
        method: "GET",
      },
      api,
      extraOptions,
    );

    if (refreshResult.meta?.response?.status === 200) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      //  if refresh token are not valid access and refresh will be removed from server
      if (typeof window !== "undefined") {
        window.location.href = LinkTo.login;
      }
    }
  }

  return result;
};
