import { userApi } from "@/api/userApi";

export const selectGetMeResult = userApi.endpoints.getMe.select(undefined);
