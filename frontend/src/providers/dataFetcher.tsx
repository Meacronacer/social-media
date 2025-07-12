"use client";

import { ReactNode } from "react";
import { useGetMeQuery } from "@/api/userApi";

export default function DataFetcher({ children }: { children: ReactNode }) {
  useGetMeQuery();

  return <>{children}</>;
}
