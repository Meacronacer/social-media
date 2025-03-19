import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chat {
  _id: string;
  first_name: string;
  second_name: string;
  img_url: string;
}

interface ChatState {
  newUser: Chat;
  activeChats: Chat[];
}

const initialState: ChatState = {
  newUser: {
    _id: "",
    first_name: "",
    second_name: "",
    img_url: "",
  },
  activeChats: [],
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addActiveChat: (state, action: PayloadAction<Chat>) => {
      // Проверяем, есть ли чат уже в списке
      const exists = state.activeChats.some(
        (chat) => chat._id === action.payload._id,
      );
      if (!exists) {
        state.activeChats.push(action.payload);
      }
    },
    setNewUser: (state, action) => {
      state.newUser = action.payload;
    },
    setActiveChats: (state, action: PayloadAction<Chat[]>) => {
      state.activeChats = action.payload;
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
  addActiveChat,
  setActiveChats,
  clearChats,
  clearNewUser,
  setNewUser,
} = chatSlice.actions;

export default chatSlice.reducer;
