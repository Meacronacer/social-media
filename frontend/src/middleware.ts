import { NextRequest, NextResponse } from "next/server";
import { LinkTo } from "@/utils/links";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const currentUrl = request.nextUrl;

  // Если пользователь авторизован, но находится на страницах /login или /sign-up, перенаправляем его на главную
  if (
    accessToken &&
    (currentUrl.pathname === LinkTo.login ||
      currentUrl.pathname === LinkTo.signUp)
  ) {
    return NextResponse.redirect(new URL(LinkTo.home, request.url));
  }

  // Если пользователь не авторизован и пытается попасть на защищённые страницы, перенаправляем на /login
  if (
    !accessToken &&
    ![LinkTo.login, LinkTo.signUp].includes(currentUrl.pathname)
  ) {
    // Проверяем, не выполняется ли уже редирект на /login
    if (currentUrl.pathname !== LinkTo.login) {
      return NextResponse.redirect(new URL(LinkTo.login, request.url));
    }
  }

  // Если пользователь не авторизован, но уже находится на /login или /sign-up, пропускаем запрос
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
