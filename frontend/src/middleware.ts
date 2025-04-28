import { NextResponse, NextRequest } from "next/server";
// import { jwtVerify } from "jose";
// import { LinkTo } from "@/utils/links";

export async function middleware(request: NextRequest) {
  //const accessToken = request.cookies.get("accessToken")?.value;
  //const refreshToken = request.cookies.get("refreshToken")?.value;
  // const currentUrl = request.nextUrl;
  // const accessSecretKey = process.env.JWT_ACCESS_SECRET;
  // const refreshSecretKey = process.env.JWT_REFRESH_SECRET;

  console.log("RAW COOKIE HEADER:", request.headers.get("cookie"));

  // let isAccessValid = false;
  // let isRefreshValid = false;

  // // Проверка валидности access токена
  // if (accessToken && accessSecretKey) {
  //   try {
  //     const secret = new TextEncoder().encode(accessSecretKey);
  //     await jwtVerify(accessToken, secret);
  //     isAccessValid = true;
  //   } catch {
  //     console.error("Access token expired");
  //   }
  // }

  // // Проверка валидности refresh токена
  // if (refreshToken && refreshSecretKey) {
  //   try {
  //     const secret = new TextEncoder().encode(refreshSecretKey);
  //     await jwtVerify(refreshToken, secret);
  //     isRefreshValid = true;
  //   } catch {
  //     console.error("Refresh token invalid or expired");
  //   }
  // }

  // // Определяем страницы авторизации
  // const isAuthPage = [LinkTo.login, LinkTo.signUp].includes(
  //   currentUrl.pathname,
  // );

  // // Если пользователь на странице авторизации
  // if (isAuthPage) {
  //   // При валидном refresh токене редиректим на главную
  //   if (isRefreshValid) {
  //     return NextResponse.redirect(new URL(LinkTo.home, request.url));
  //   }
  //   // Если токены невалидны, очищаем куки и разрешаем остаться
  //   if (!isAccessValid && !isRefreshValid) {
  //     console.error("access & refresh tokens are not valids, deleting it!");
  //     const response = NextResponse.next();
  //     response.cookies.delete("accessToken");
  //     response.cookies.delete("refreshToken");
  //     return response;
  //   }
  //   return NextResponse.next();
  // }

  // // Для всех остальных страниц
  // if (!isRefreshValid && !isAccessValid) {
  //   // Удаляем куки и редиректим на логин при невалидных токенах
  //   const response = NextResponse.redirect(new URL(LinkTo.login, request.url));
  //   response.cookies.delete("accessToken");
  //   response.cookies.delete("refreshToken");
  //   return response;
  // }

  // Разрешаем доступ если хотя бы refresh токен валиден
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/chats/:id*",
    "/settings",
    "/search",
  ],
};
