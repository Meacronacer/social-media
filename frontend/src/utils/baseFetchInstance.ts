import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { LinkTo } from "./links";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  credentials: "include",
});

// Создаем глобальный мьютекс для обновления токена
const mutex = new Mutex();

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Если другой запрос уже обновляет токен, ждем его завершения
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Если мьютекс свободен, захватываем его для обновления токена
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/api/auth/refresh",
            method: "GET",
          },
          api,
          extraOptions,
        );

        if (refreshResult.meta?.response?.status === 200) {
          // После успешного обновления повторяем исходный запрос
          result = await baseQuery(args, api, extraOptions);
        } else {
          // на сервер куки удаляються если ответ не равен 200
          // Если обновление не удалось – перенаправляем на страницу логина
          if (typeof window !== "undefined") {
            window.location.href = LinkTo.login;
          }
        }
      } finally {
        release();
      }
    } else {
      // Если мьютекс уже занят, ждем его освобождения и повторяем запрос
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
