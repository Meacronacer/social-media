import { BaseApi, baseHeadersOptions } from "@/utils/baseFetch";

export interface Ichat {
  is_active: boolean;
  lastMessage: {
    sender: string;
    recipient: string;
    _id: string;
    text: string;
    timestamp: string;
    status: string;
  };
  participants: {
    _id: string;
    first_name: string;
    second_name: string;
    img_url: string | undefined;
  };
  unreadMessages: Object | number;
}

export const chatsApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllActiveChats: builder.query<Ichat[], string>({
      query: (searchTerm = "") => ({
        url: `/api/chats/active?search=${encodeURIComponent(searchTerm)}`,
        method: "GET",
        headers: baseHeadersOptions,
      }),
    }),
    getChatMessages: builder.query({
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
