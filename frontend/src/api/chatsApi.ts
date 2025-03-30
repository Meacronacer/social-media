import { Ichat } from "@/@types/chat";
import { IMessage } from "@/@types/message";
import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export const chatsApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllActiveChats: builder.query<Ichat[], string>({
      query: (searchTerm = "") => ({
        url: `/api/chats/active?search=${encodeURIComponent(searchTerm)}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
    }),
    getChatMessages: builder.query<
      { messages: IMessage[]; hasMore: boolean },
      { chatId: string; limit: string | number; lastMessageId?: string }
    >({
      query: ({ chatId, limit, lastMessageId }) => ({
        url: `/api/chats/${chatId}/messages?limit=${limit}&lastMessageId=${lastMessageId || ""}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
      providesTags: (result, error, { chatId }) => [
        { type: "ChatMessages", id: chatId },
      ],
    }),
    getUnreadMessagesCount: builder.query<{ totalUnread: number }, void>({
      query: () => ({
        url: "/api/chats/unread-count",
        method: "GET",
        headers: baseHeadersOptions,
      }),
    }),
  }),
});

export const {
  useGetAllActiveChatsQuery,
  useGetChatMessagesQuery,
  useGetUnreadMessagesCountQuery,
  useLazyGetChatMessagesQuery,
} = chatsApi;
