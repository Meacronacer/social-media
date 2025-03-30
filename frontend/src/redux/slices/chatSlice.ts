import { Ichat } from "@/@types/chat";
import { IMessage } from "@/@types/message";
import { IAuthor } from "@/@types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  activeChats: Ichat[];
  newUser: IAuthor;
  totalUnread: number;
  chats: {
    [chatId: string]: {
      unread: number;
      lastMessage?: IMessage;
    };
  } | null;
}

const initialState: ChatState = {
  activeChats: [],
  totalUnread: 0,
  chats: null,
  newUser: {
    _id: "",
    first_name: "",
    second_name: "",
    img_url: "",
  },
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setActiveChats: (state, action: PayloadAction<Ichat[]>) => {
      state.activeChats = action.payload;
    },
    addNewChat: (state, action: PayloadAction<Ichat>) => {
      state.activeChats.unshift(action.payload);
    },
    updateChat(
      state,
      action: PayloadAction<{ roomId: string; data: Partial<Ichat> }>,
    ) {
      state.activeChats = state.activeChats.map((chat) =>
        chat._id === action.payload.roomId
          ? {
              ...chat,
              lastMessage: action.payload.data.lastMessage ?? chat.lastMessage,
              unreadMessages: action.payload.data.unreadMessages,
            }
          : chat,
      );
    },
    updateUnreadCount(state, action: PayloadAction<number>) {
      state.totalUnread = action.payload;
    },
    changeUnreadCount(state, action: PayloadAction<number>) {
      state.totalUnread = Math.max(0, state.totalUnread + action.payload);
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload;
    },
    setTotalUnread: (state, action) => {
      state.totalUnread = action.payload;
    },
    clearChats: (state) => {
      state.activeChats = [];
    },
    clearNewUser: (state) => {
      state.newUser = {
        _id: "",
        first_name: "",
        second_name: "",
        img_url: "",
      };
    },
  },
});

export const {
  setActiveChats,
  addNewChat,
  clearChats,
  clearNewUser,
  setNewUser,
  updateChat,
  updateUnreadCount,
  setTotalUnread,
  changeUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
